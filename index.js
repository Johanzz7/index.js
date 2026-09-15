const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Importar comandos
const comandos = require('./comandos');

let sock;

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  // Mostrar código QR
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 Escanea este código QR con WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado a WhatsApp');
    }

    if (connection === 'close') {
      let motivo = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date());
      
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        conectar();
      } else {
        console.log('❌ WhatsApp cerró sesión. Debes volver a conectarte.');
      }
    }
  });

  // Guardar credenciales
  sock.ev.on('creds.update', saveCreds);

  // Escuchar mensajes
  sock.ev.on('messages.upsert', async (m) => {
    const mensaje = m.messages[0];

    if (!mensaje.message) return;

    const remitente = mensaje.key.remoteJid;
    const esGrupo = remitente.includes('@g.us');
    const texto = mensaje.message.conversation || mensaje.message.extendedTextMessage?.text || '';
    const nombreRemitente = mensaje.pushName;

    console.log(`📨 [${esGrupo ? 'GRUPO' : 'PRIVADO'}] ${nombreRemitente}: ${texto}`);

    // Procesar comandos
    await procesarComandos(texto, remitente, sock, mensaje);
  });
}

async function procesarComandos(texto, remitente, sock, mensaje) {
  const args = texto.trim().split(' ');
  const comando = args[0].toLowerCase();

  // Buscar si existe el comando
  for (const cmd of comandos) {
    if (cmd.nombre === comando) {
      try {
        await cmd.ejecutar(sock, remitente, args.slice(1), mensaje);
      } catch (error) {
        console.error(`❌ Error en comando ${comando}:`, error);
        await sock.sendMessage(remitente, { text: `❌ Error al ejecutar el comando: ${error.message}` });
      }
      return;
    }
  }
}

conectar().catch(console.log);
