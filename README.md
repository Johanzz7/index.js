# 🌸 UMI ASANAGUI - Bot de WhatsApp

Bot de WhatsApp diseñado para gestionar grupos de Free Fire con comandos útiles y diversión.

## 🚀 Características

- ✅ Comandos generales (!menu, !ping, !hola, !info)
- 🎮 Comandos de Free Fire (registro, plantilla, roles, etc.)
- 🛡️ Comandos de administración (kick, promote, demote, tagall)
- 🎲 Comandos de diversión (dado, moneda, 8ball)

## 📋 Requisitos

- Node.js v14 o superior
- npm o yarn

## 📦 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/Johanzz7/index.js.git
cd index.js
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Ejecuta el bot:**
```bash
npm start
```

4. **Escanea el código QR** con WhatsApp cuando aparezca en la terminal.

## 📝 Comandos Disponibles

### 🤖 Generales
- `!menu` - Muestra el menú principal
- `!ping` - Verifica que el bot está activo
- `!hola` - Saludo personalizado
- `!info` - Información del bot

### 🎲 Diversión
- `!dado` - Lanza un dado (1-6)
- `!moneda` - Lanza una moneda (Cara/Cruz)
- `!8ball` - Bola 8 mágica

### 🎮 Free Fire (Próximamente)
- `!registro`
- `!plantilla`
- `!roles`
- `!scrim`
- `!entreno`
- `!ligas`
- `!honor`
- `!discord`

### 🛡️ Administración (Próximamente)
- `!kick @usuario`
- `!promote @usuario`
- `!demote @usuario`
- `!tagall`
- `!aviso`

## 📂 Estructura del Proyecto

```
index.js/
├── index.js              # Archivo principal
├── config.js             # Configuración del bot
├── utils.js              # Funciones utilitarias
├── package.json          # Dependencias
├── .gitignore            # Archivos ignorados
├── README.md             # Este archivo
└── comandos/             # Carpeta de comandos
    ├── index.js          # Índice de comandos
    ├── menu.js
    ├── ping.js
    ├── hola.js
    ├── info.js
    ├── dado.js
    ├── moneda.js
    └── 8ball.js
```

## 🔧 Configuración

Edita `config.js` para personalizar:

- Nombre del bot
- Descripción
- Versión
- Autor

## 📚 Cómo Agregar Comandos

1. Crea un nuevo archivo en la carpeta `comandos/`:

```javascript
// comandos/micomando.js
const { enviarMensaje } = require('../utils');

module.exports = {
  nombre: '!micomando',
  descripcion: 'Descripción de mi comando',
  async ejecutar(socket, chat, args, mensaje) {
    await enviarMensaje(socket, chat, '¡Hola! Este es mi comando');
  }
};
```

2. Agrega el comando al índice en `comandos/index.js`:

```javascript
const micomando = require('./micomando');

module.exports = [
  // ... otros comandos
  micomando
];
```

## ⚠️ Notas Importantes

- El bot necesita estar conectado a WhatsApp para funcionar
- La sesión se guarda en `auth_info_baileys/`
- No compartas tu código QR con nadie
- El bot responderá a comandos que comiencen con `!`

## 📄 Licencia

MIT

## 👨‍💻 Autor

**Johanzz7**

## 📞 Soporte

Si tienes problemas o sugerencias, abre un issue en el repositorio.

---

**¡Disfruta usando UMI ASANAGUI! 🌸**
