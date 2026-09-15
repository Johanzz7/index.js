const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./database');

const client = new Client({
  authStrategy: new LocalAuth(),
  headless: true
});

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

client.on('qr', qr => {
  console.log('\n📱 Escanea este código QR con WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n');
});

client.on('ready', () => {
  console.log('✅ Bot conectado a WhatsApp!');
  console.log(`📚 ${comandos.size} comandos cargados`);
});

client.on('message_create', async (message) => {
  try {
    // Ignorar mensajes del bot
    if (message.fromMe) return;
    
    const prefix = process.env.PREFIX || '!';
    const contenido = message.body.trim();
    
    // Verificar si es un comando
    if (!contenido.startsWith(prefix)) return;
    
    // Parsear comando
    const args = contenido.slice(prefix.length).trim().split(/\s+/);
    const nombreComando = args.shift().toLowerCase();
    
    // Buscar comando
    const comando = comandos.get(nombreComando);
    if (!comando) {
      return message.reply('❌ Comando no encontrado. Usa *!ayuda* para ver todos los comandos.');
    }
    
    // Verificar permisos de admin
    if (comando.admin) {
      const admins = process.env.ADMINS ? process.env.ADMINS.split(',') : [];
      const isAdmin = message.author && admins.includes(message.author);
      
      if (!isAdmin) {
        return message.reply('❌ Solo administradores pueden usar este comando.');
      }
    }
    
    // Ejecutar comando
    const chat = await message.getChat();
    await comando.executar(client, chat, args, message.from, message);
    
  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    message.reply('❌ Ocurrió un error al procesar tu comando.');
  }
});

client.on('disconnected', (reason) => {
  console.log('🔌 Bot desconectado:', reason);
  process.exit(1);
});

client.initialize().catch(err => {
  console.error('❌ Error iniciando bot:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n👋 Cerrando bot...');
  client.destroy();
  db.cerrar();
  process.exit(0);
});
