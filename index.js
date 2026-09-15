const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');\nconst path = require('path');
require('dotenv').config();
const db = require('./database');

// Cargar todos los comandos
const comandos = new Map();
const comandosDir = path.join(__dirname, 'comandos');

if (fs.existsSync(comandosDir)) {
  const archivos = fs.readdirSync(comandosDir).filter(file => file.endsWith('.js'));
  
  archivos.forEach(archivo => {
    try {
      const comando = require(path.join(comandosDir, archivo));
      comandos.set(comando.nome, comando);
      
      if (comando.alias && Array.isArray(comando.alias)) {
        comando.alias.forEach(alias => {
          comandos.set(alias, comando);
        });
      }
      console.log(`✅ Comando cargado: ${comando.nome}`);
    } catch (e) {
      console.error(`❌ Error cargando ${archivo}:`, e.message);
    }
  });
}

// Inicializar bot
async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n📱 Escanea este código QR con WhatsApp:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'connecting') {
      console.log('🔌 Conectando...');
    } else if (connection === 'open') {
      console.log('✅ Bot conectado a WhatsApp!');
      console.log(`📚 ${comandos.size} comandos cargados\n`);
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('🔌 Conexión cerrada. Reconectando...', shouldReconnect);
      
      if (shouldReconnect) {
        setTimeout(() => iniciarBot(), 3000);
      }
    }
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    
    if (!message.message) return;
    if (message.key.fromMe) return;

    try {
      const contenido = message.message.conversation || message.message.extendedTextMessage?.text || '';
      if (!contenido) return;

      const prefix = process.env.PREFIX || '!';
      
      // Verificar si es un comando
      if (!contenido.startsWith(prefix)) return;
      
      // Parsear comando
      const args = contenido.slice(prefix.length).trim().split(/\s+/);
      const nombreComando = args.shift().toLowerCase();
      
      // Buscar comando
      const comando = comandos.get(nombreComando);
      if (!comando) {
        return socket.sendMessage(message.key.remoteJid, {
          text: '❌ Comando no encontrado. Usa *!ayuda* para ver todos los comandos.'
        });
      }
      
      // Verificar permisos de admin
      if (comando.admin) {
        const admins = process.env.ADMINS ? process.env.ADMINS.split(',') : [];
        const isAdmin = admins.includes(message.key.participant);
        
        if (!isAdmin) {
          return socket.sendMessage(message.key.remoteJid, {
            text: '❌ Solo administradores pueden usar este comando.'
          });
        }
      }
      
      // Ejecutar comando
      await comando.executar(socket, message.key.remoteJid, args, message.key.participant, message);
      
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error);
      socket.sendMessage(message.key.remoteJid, {
        text: '❌ Ocurrió un error al procesar tu comando.'
      });
    }
  });

  process.on('SIGINT', () => {
    console.log('\n👋 Cerrando bot...');
    socket.end();
    db.cerrar();
    process.exit(0);
  });
}

iniciarBot().catch(err => {
  console.error('❌ Error iniciando bot:', err);
  process.exit(1);
});
