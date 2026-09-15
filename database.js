const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Crear carpeta data si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'bot.db'));

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS miembros (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    numero TEXT NOT NULL UNIQUE,
    rango TEXT DEFAULT 'Lurker',
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    warns INTEGER DEFAULT 0,
    fecha_registro TEXT NOT NULL,
    estado TEXT DEFAULT 'activo'
  );

  CREATE TABLE IF NOT EXISTS entrenamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    descripcion TEXT,
    asistentes TEXT,
    estado TEXT DEFAULT 'pendiente'
  );

  CREATE TABLE IF NOT EXISTS scrims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    rival TEXT NOT NULL,
    resultado TEXT,
    equipo_umi TEXT,
    equipo_rival TEXT,
    estado TEXT DEFAULT 'pendiente'
  );

  CREATE TABLE IF NOT EXISTS warns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    miembro_id TEXT NOT NULL,
    razon TEXT NOT NULL,
    admin_id TEXT NOT NULL,
    fecha TEXT NOT NULL,
    FOREIGN KEY (miembro_id) REFERENCES miembros(id)
  );

  CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    admin_id TEXT NOT NULL,
    fecha TEXT NOT NULL,
    importancia TEXT DEFAULT 'normal'
  );

  CREATE TABLE IF NOT EXISTS configuracion (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
  );
`);

console.log('✅ Base de datos inicializada con better-sqlite3');

module.exports = {
  db,
  
  // Miembros
  agregarMiembro: (id, nombre, numero, rango = 'Lurker') => {
    try {
      const stmt = db.prepare(`
        INSERT INTO miembros (id, nombre, numero, rango, fecha_registro)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(id, nombre, numero, rango, new Date().toISOString());
      return true;
    } catch (e) {
      console.error('❌ Error agregando miembro:', e);
      return false;
    }
  },

  obtenerMiembros: () => {
    try {
      return db.prepare('SELECT * FROM miembros WHERE estado = "activo" ORDER BY rango DESC').all();
    } catch (e) {
      console.error('❌ Error obteniendo miembros:', e);
      return [];
    }
  },

  obtenerMiembro: (id) => {
    try {
      return db.prepare('SELECT * FROM miembros WHERE id = ?').get(id);
    } catch (e) {
      console.error('❌ Error obteniendo miembro:', e);
      return null;
    }
  },

  actualizarRango: (id, rango) => {
    try {
      db.prepare('UPDATE miembros SET rango = ? WHERE id = ?').run(rango, id);
      return true;
    } catch (e) {
      console.error('❌ Error actualizando rango:', e);
      return false;
    }
  },

  agregarWarn: (miembroId, razon, adminId) => {
    try {
      db.prepare(`
        INSERT INTO warns (miembro_id, razon, admin_id, fecha)
        VALUES (?, ?, ?, ?)
      `).run(miembroId, razon, adminId, new Date().toISOString());
      
      const warns = db.prepare('SELECT COUNT(*) as total FROM warns WHERE miembro_id = ?').get(miembroId);
      
      if (warns.total >= 3) {
        db.prepare('UPDATE miembros SET estado = ? WHERE id = ?').run('expulsado', miembroId);
        return { expulsado: true, warns: warns.total };
      }
      
      return { expulsado: false, warns: warns.total };
    } catch (e) {
      console.error('❌ Error agregando warn:', e);
      return null;
    }
  },

  obtenerWarns: (miembroId) => {
    try {
      return db.prepare('SELECT * FROM warns WHERE miembro_id = ? ORDER BY fecha DESC').all(miembroId);
    } catch (e) {
      console.error('❌ Error obteniendo warns:', e);
      return [];
    }
  },

  // Entrenamientos
  agregarEntrenamiento: (fecha, hora, descripcion) => {
    try {
      db.prepare(`
        INSERT INTO entrenamientos (fecha, hora, descripcion)
        VALUES (?, ?, ?)
      `).run(fecha, hora, descripcion);
      return true;
    } catch (e) {
      console.error('❌ Error agregando entrenamiento:', e);
      return false;
    }
  },

  obtenerEntrenamientos: () => {
    try {
      return db.prepare('SELECT * FROM entrenamientos ORDER BY fecha DESC').all();
    } catch (e) {
      console.error('❌ Error obteniendo entrenamientos:', e);
      return [];
    }
  },

  // Scrims
  agregarScrim: (fecha, hora, rival) => {
    try {
      db.prepare(`
        INSERT INTO scrims (fecha, hora, rival)
        VALUES (?, ?, ?)
      `).run(fecha, hora, rival);
      return true;
    } catch (e) {
      console.error('❌ Error agregando scrim:', e);
      return false;
    }
  },

  obtenerScrims: () => {
    try {
      return db.prepare('SELECT * FROM scrims ORDER BY fecha DESC').all();
    } catch (e) {
      console.error('❌ Error obteniendo scrims:', e);
      return [];
    }
  },

  // Anuncios
  agregarAnuncio: (titulo, contenido, adminId, importancia = 'normal') => {
    try {
      db.prepare(`
        INSERT INTO anuncios (titulo, contenido, admin_id, fecha, importancia)
        VALUES (?, ?, ?, ?, ?)
      `).run(titulo, contenido, adminId, new Date().toISOString(), importancia);
      return true;
    } catch (e) {
      console.error('❌ Error agregando anuncio:', e);
      return false;
    }
  },

  obtenerAnuncios: () => {
    try {
      return db.prepare('SELECT * FROM anuncios ORDER BY fecha DESC LIMIT 10').all();
    } catch (e) {
      console.error('❌ Error obteniendo anuncios:', e);
      return [];
    }
  },

  cerrar: () => {
    try {
      db.close();
      console.log('✅ Base de datos cerrada');
    } catch (e) {
      console.error('❌ Error cerrando base de datos:', e);
    }
  }
};
