# Librería Node

Una aplicación web full-stack construida con **Express.js**, **Sequelize** y **MySQL** para gestionar una librería en línea.

## Características

- **Autenticación de usuarios** - Registro y login con contraseñas encriptadas (bcrypt)
- **Catálogo de libros** - Visualización y búsqueda de libros disponibles
- **Sistema de reseñas** - Los usuarios pueden dejar reseñas en los libros
- **Perfiles de usuario** - Gestión de cuentas de usuario
- **Notificaciones por email** - Comunicación con usuarios (Nodemailer)
- **Chat AI** - Integración con Groq SDK para asistencia
- **Interfaz responsiva** - Desarrollada con Bootstrap

## Tecnologías

### Backend
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL2** - Driver de base de datos
- **JWT** - Autenticación por tokens
- **bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails
- **Groq SDK** - IA conversacional
- **Cookie Parser** - Gestión de cookies

### Frontend
- **Pug** - Motor de plantillas
- **Bootstrap** - Estilos y componentes
- **CSS personalizado** - Estilos adicionales

### Herramientas de Desarrollo
- **Node.js** - Entorno de ejecución
- **Nodemon** - Recarga automática en desarrollo
- **Dotenv** - Variables de entorno

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repositorio>
   cd libreriaNode
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=libreria
   JWT_SECRET=tu_clave_secreta
   GROQ_API_KEY=tu_clave_groq
   ```

4. **Crea la base de datos**
   ```sql
   CREATE DATABASE libreria;
   ```

## Scripts Disponibles

- `npm start` - Inicia la aplicación en producción
- `npm run dev` - Inicia la aplicación en modo desarrollo con Nodemon

## Estructura del Proyecto

```
libreriaNode/
├── config/               # Configuración de base de datos
│   └── db.js
├── controllers/          # Controladores de rutas
│   ├── bookController.js
│   ├── chatController.js
│   ├── contactoController.js
│   ├── paginaController.js
│   └── usuarioController.js
├── middleware/          # Middlewares personalizados
│   └── identificarUsuario.js
├── models/              # Modelos de base de datos
│   ├── Resenias.js
│   └── Usuario.js
├── public/              # Archivos estáticos
│   ├── css/
│   │   ├── bootstrap.css
│   │   └── style.css
│   └── img/
│       └── libreria.avif
├── route/               # Definición de rutas
│   └── index.js
├── views/               # Plantillas Pug
│   ├── contacto.pug
│   ├── detalles.pug
│   ├── inicio.pug
│   ├── ofertas.pug
│   ├── resenias.pug
│   ├── resultados.pug
│   ├── auth/
│   │   ├── login.pug
│   │   └── registro.pug
│   └── layout/
│       ├── footer.pug
│       ├── header.pug
│       └── index.pug
├── index.js             # Punto de entrada principal
├── package.json         # Dependencias del proyecto
└── README.md            # Este archivo
```

## Rutas Principales

Las rutas están definidas en `route/index.js` y organizadas por funcionalidad:
- **Autenticación**: Login, registro, logout
- **Libros**: Catálogo, detalles, búsqueda
- **Reseñas**: Ver y crear reseñas
- **Usuarios**: Perfil y configuración
- **Chat**: Interacción con IA
- **Contacto**: Formulario de contacto

## Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación con JWT
- Middleware de identificación de usuario
- Validación en servidor

## Contacto

Para más información, consulta el formulario de contacto en la aplicación.

## Licencia

ISC

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2026
