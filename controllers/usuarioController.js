import { Usuario } from '../models/Usuario.js';
import jwt from 'jsonwebtoken';

// --- 1. MOSTRAR FORMULARIOS ---
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
}

// --- 2. REGISTRAR USUARIO (POST) ---
const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validar que no haya campos vacíos
    if(Object.values(req.body).includes('')) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'Todos los campos son obligatorios' }],
            usuario: { nombre, email }
        });
    }

    // Validar que el usuario no exista ya
    const existeUsuario = await Usuario.findOne({ where : { email : email } });
    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'Ese usuario ya está registrado' }],
            usuario: { nombre, email }
        });
    }

    // Almacenar en la BBDD
    try {
        await Usuario.create({ nombre, email, password });
        res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            mensaje: 'Usuario creado correctamente, ya puedes iniciar sesión'
        });
    } catch (error) {
        console.log(error);
    }
}

// --- 3. AUTENTICAR USUARIO (LOGIN) ---
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });

    if(!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{ msg: 'El Usuario no existe' }]
        });
    }

    // Comprobar si la contraseña es correcta
    if(!usuario.validarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{ msg: 'La contraseña es incorrecta' }]
        });
    }

    // --- AQUÍ ESTABA LO QUE FALTABA ---

    // 1. Generar un Token (JWT)
    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, 'palabrasecreta', {
        expiresIn: '1d' // La sesión expira en 1 día
    });

    // 2. Guardar el token en una cookie y redirigir
    console.log(`El usuario ${usuario.nombre} ha entrado correctamente`);

    res.cookie('_token', token, {
        httpOnly: true // Evita ataques XSS
    }).redirect('/');
}

// --- 4. CERRAR SESIÓN (LOGOUT) ---
// Esta función también faltaba y es necesaria para el botón "Cerrar Sesión"
const cerrarSesion = (req, res) => {
    res.clearCookie('_token').redirect('/auth/login');
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    autenticar,
    cerrarSesion // <--- No olvides exportarla
}