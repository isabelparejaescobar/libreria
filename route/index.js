import express from "express";
import axios from "axios";
import { searchBooks , getBookDetails } from '../controllers/bookController.js';
import {guardarResenias, paginaInicio, paginaResenias, paginaOfertas} from "../controllers/paginaController.js";
import { enviarCorreo } from '../controllers/contactoController.js';
const router = express.Router();
import { formularioLogin, formularioRegistro, registrar, autenticar, cerrarSesion } from '../controllers/usuarioController.js';
import { obtenerRespuestaChat } from '../controllers/chatController.js';

// ...
router.get('/auth/logout', cerrarSesion);


// =========================================================================
// 1. RUTAS DE LA APLICACIÓN
// =========================================================================

// Página principal (Buscador)
router.get('/', paginaInicio);

router.get('/login', (req , res) => {
    res.send('Login');
});

router.get('/ofertas', paginaOfertas);

router.get('/auth/login', formularioLogin);
router.post('/auth/login', autenticar);

router.get('/auth/registro', formularioRegistro);
router.post('/auth/registro', registrar);
router.get('/auth/logout', cerrarSesion);

router.post('/api/chat', obtenerRespuestaChat);

router.post('/resenias', guardarResenias);

router.get('/resenias', paginaResenias);

router.get('/ofertas', (req , res) => {
    res.render('ofertas');
});

router.get('/contacto', (req, res) => {
    res.render('contacto', {
        pagina: 'Contacto'
    });
});

router.post('/contacto', enviarCorreo);

// =========================================================================
// 2. RUTA DE BÚSQUEDA
// =========================================================================

router.get('/buscar', async (req, res) => {
    const searchTerm = req.query.q;

    try {
        if (!searchTerm) {
            return res.redirect('/');
        }

        const libros = await searchBooks(searchTerm);

        res.render('inicio', {
            pagina: `Resultados para "${searchTerm}"`,
            libros: libros,
            searchTerm: searchTerm
        });
    } catch (error) {
        console.error("Error al buscar libros en la API:", error.message);
        res.render('inicio', {
            pagina: 'Error de Búsqueda',
            error: error.message,
            libros: [],
            searchTerm: searchTerm
        });
    }
});



router.get('/libro/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const libro = await getBookDetails(id);

        res.render('detalles', {
            pagina: libro.titulo,
            libro
        });

    } catch (error) {
        console.error(error.message);
        res.redirect('/');
    }
});

export default router;