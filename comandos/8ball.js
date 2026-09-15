const { formatearMensaje } = require('../utils');

module.exports = {
  nome: '8ball',
  alias: ['pregunta', 'magic'],
  descricao: 'Hacer una pregunta a la bola mágica',
  uso: '!8ball <pregunta>',
  
  async executar(socket, chat, args, remitente, mensagem) {
    if (args.length === 0) {
      return socket.sendMessage(chat, {
        text: formatearMensaje('❌ ERROR', `
┃ Usa: !8ball <tu pregunta>
        `.trim())
      });
    }

    const respuestas = [
      '✅ Definitivamente sí',
      '✅ Es cierto',
      '✅ Muy probable',
      '❓ Quizás',
      '❓ Pregunta más tarde',
      '❌ Definitivamente no',
      '❌ No lo creo',
      '❌ Imposible'
    ];

    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    
    const msg = `
╭━━━ 🔮 BOLA MÁGICA 🔮 ━━━╮
┃
┃ 🤔 Pregunta: ${args.join(' ')}
┃
┃ 🔮 Respuesta: ${respuesta}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
    `.trim();

    socket.sendMessage(chat, { text: msg });
  }
};