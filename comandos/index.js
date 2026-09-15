// Importar todos los comandos
const menu = require('./menu');
const ping = require('./ping');
const hola = require('./hola');
const info = require('./info');
const dado = require('./dado');
const moneda = require('./moneda');
const ball8 = require('./8ball');

// Exportar array de comandos
module.exports = [
  menu,
  ping,
  hola,
  info,
  dado,
  moneda,
  ball8
];
