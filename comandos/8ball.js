const { enviarMensaje } = require('../utils');

module.exports = {
  nombre: '!8ball',
  descripcion: 'Haz una pregunta y recibe una respuesta mística',
  async ejecutar(socket, chat, args, mensaje) {
    const respuestas = [
      '✅ Sí, definitivamente',
      '✅ Es seguro que sí',
      '✅ Parece que sí',
      '❓ Quizás',
      '❓ No estoy seguro',
      '❓ Puede ser',
      '❌ No',
      '❌ Definitivamente no',
      '❌ No parece probable',
      '⚠️ Mejor no preguntar',
      '⚠️ Pregunta más tarde',
      '⚠️ Concentríate y pregunta de nuevo'
    ];
    
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    
    await enviarMensaje(socket, chat, `🔮 Bola 8 mágica dice:\n\n*${respuesta}*`);
  }
};
