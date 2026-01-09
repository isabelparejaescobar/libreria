import express from "express";
import axios from "axios";
import { searchBooks } from '../controllers/bookController.js';
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
        // Hacemos la petición DIRECTAMENTE aquí usando Axios
        // (Reemplazamos la función getBookDetails que no existía)
        const respuesta = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const datosGoogle = respuesta.data;

        // Limpiamos los datos para que tu PUG los entienda
        const libro = {
            titulo: datosGoogle.volumeInfo.title,
            subtitulo: datosGoogle.volumeInfo.subtitle,
            autores: datosGoogle.volumeInfo.authors ? datosGoogle.volumeInfo.authors.join(', ') : 'Desconocido',
            descripcion: datosGoogle.volumeInfo.description || 'Sin descripción disponible.',
            imagen: datosGoogle.volumeInfo.imageLinks ? (datosGoogle.volumeInfo.imageLinks.large || datosGoogle.volumeInfo.imageLinks.thumbnail) : null,
            editorial: datosGoogle.volumeInfo.publisher,
            fechaPublicacion: datosGoogle.volumeInfo.publishedDate,
            paginas: datosGoogle.volumeInfo.pageCount,
            categorias: datosGoogle.volumeInfo.categories ? datosGoogle.volumeInfo.categories.join(', ') : 'General',
            isbn: datosGoogle.volumeInfo.industryIdentifiers ? datosGoogle.volumeInfo.industryIdentifiers[0].identifier : 'No disponible',
            idioma: datosGoogle.volumeInfo.language,
            precio: datosGoogle.saleInfo.listPrice ? `${datosGoogle.saleInfo.listPrice.amount} ${datosGoogle.saleInfo.listPrice.currencyCode}` : 'No disponible / Gratis',
            linkCompra: datosGoogle.saleInfo.buyLink,
            _id: datosGoogle.id
        };

        // Renderizamos la vista 'detalle
        res.render('detalles', {
            pagina: libro.titulo,
            libro: libro
        });

    } catch (error) {
        console.error("Error al obtener detalles:", error.message);
        // Si el ID no es válido o Google falla, redirigimos al inicio
        res.redirect('/');
    }
});

export default router;