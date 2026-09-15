const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Crear carpeta data si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'umi.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con SQLite:', err);
  } else {
    console.log('✅ Base de datos SQLite conectada');
    inicializarTablas();
  }
});

// Inicializar tablas
function inicializarTablas() {
  db.serialize(() => {
    // Tabla de miembros
    db.run(`
      CREATE TABLE IF NOT EXISTS miembros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        nick TEXT NOT NULL,
        rol TEXT NOT NULL,
        puntos INTEGER DEFAULT 0,
        estado TEXT DEFAULT 'activo',
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de warns
    db.run(`
      CREATE TABLE IF NOT EXISTS warns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL,
        razon TEXT,
        cantidad INTEGER DEFAULT 1,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de entrenamientos
    db.run(`
      CREATE TABLE IF NOT EXISTS entrenamientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia TEXT NOT NULL,
        hora TEXT NOT NULL,
        sala TEXT
      )
    `);

    // Tabla de scrims
    db.run(`
      CREATE TABLE IF NOT EXISTS scrims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        sala TEXT NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        resultado TEXT
      )
    `);

    // Tabla de roster
    db.run(`
      CREATE TABLE IF NOT EXISTS roster (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jugador TEXT NOT NULL,
        posicion INTEGER,
        tipo TEXT DEFAULT 'titular'
      )
    `);

    // Tabla de configuración
    db.run(`
      CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clave TEXT UNIQUE NOT NULL,
        valor TEXT
      )
    `);

    console.log('📊 Tablas inicializadas correctamente');
  });
}

// Funciones auxiliares
const database = {
  // Miembros
  registrarMiembro: (nombre, nick, rol, callback) => {
    db.run(
      `INSERT INTO miembros (nombre, nick, rol) VALUES (?, ?, ?)`,
      [nombre, nick, rol],
      callback
    );
  },

  obtenerMiembro: (nombre, callback) => {
    db.get(`SELECT * FROM miembros WHERE nombre = ?`, [nombre], callback);
  },

  obtenerTodosMiembros: (callback) => {
    db.all(`SELECT * FROM miembros ORDER BY puntos DESC`, callback);
  },

  actualizarPuntos: (nombre, puntos, callback) => {
    db.run(
      `UPDATE miembros SET puntos = puntos + ? WHERE nombre = ?`,
      [puntos, nombre],
      callback
    );
  },

  eliminarMiembro: (nombre, callback) => {
    db.run(`DELETE FROM miembros WHERE nombre = ?`, [nombre], callback);
  },

  cambiarEstado: (nombre, estado, callback) => {
    db.run(
      `UPDATE miembros SET estado = ? WHERE nombre = ?`,
      [estado, nombre],
      callback
    );
  },

  cambiarRol: (nombre, rol, callback) => {
    db.run(
      `UPDATE miembros SET rol = ? WHERE nombre = ?`,
      [rol, nombre],
      callback
    );
  },

  // Warns
  agregarWarn: (usuario, razon, callback) => {
    db.run(
      `INSERT INTO warns (usuario, razon) VALUES (?, ?)`,
      [usuario, razon],
      callback
    );
  },

  obtenerWarns: (usuario, callback) => {
    db.get(
      `SELECT SUM(cantidad) as total FROM warns WHERE usuario = ?`,
      [usuario],
      callback
    );
  },

  eliminarWarn: (usuario, callback) => {
    db.run(`DELETE FROM warns WHERE usuario = ?`, [usuario], callback);
  },

  // Entrenamientos
  agregarEntrenamiento: (dia, hora, sala, callback) => {
    db.run(
      `INSERT INTO entrenamientos (dia, hora, sala) VALUES (?, ?, ?)`,
      [dia, hora, sala],
      callback
    );
  },

  obtenerEntrenamientos: (callback) => {
    db.all(`SELECT * FROM entrenamientos`, callback);
  },

  // Scrims
  crearScrim: (fecha, hora, sala, callback) => {
    db.run(
      `INSERT INTO scrims (fecha, hora, sala) VALUES (?, ?, ?)`,
      [fecha, hora, sala],
      callback
    );
  },

  obtenerScrims: (callback) => {
    db.all(`SELECT * FROM scrims WHERE estado = 'pendiente'`, callback);
  },

  // Roster
  agregarAlRoster: (jugador, posicion, tipo, callback) => {
    db.run(
      `INSERT INTO roster (jugador, posicion, tipo) VALUES (?, ?, ?)`,
      [jugador, posicion, tipo],
      callback
    );
  },

  obtenerRoster: (callback) => {
    db.all(`SELECT * FROM roster ORDER BY posicion`, callback);
  },

  // Configuración
  establecerConfig: (clave, valor, callback) => {
    db.run(
      `INSERT OR REPLACE INTO config (clave, valor) VALUES (?, ?)`,
      [clave, valor],
      callback
    );
  },

  obtenerConfig: (clave, callback) => {
    db.get(`SELECT valor FROM config WHERE clave = ?`, [clave], callback);
  },

  // Cierre
  cerrar: () => {
    db.close();
  }
};

module.exports = database;
