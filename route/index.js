// routes/index.js

import express from "express";
import { searchBooks } from '../controllers/bookController.js'; // Importación necesaria

const router = express.Router();

// =========================================================================
// 1. RUTAS DE LA APLICACIÓN (Tu código original)
// =========================================================================

// Página principal (Usamos 'inicio' como tu vista por defecto)
router.get('/', (req , res) => {
    // Esta ruta se convierte en el Buscador
    res.render('inicio', {
        pagina: 'Buscador de la Librería', // Título para el Buscador
        libros: [],
        searchTerm: ''
    });
});

router.get('/login', (req , res) => {
    res.send('Login');
});

router.get('/resenias', (req , res) => {
    res.render('resenias');
});

router.get('/ofertas', (req , res) => {
    res.render('ofertas');
});

router.get('/contacto', (req , res) => {
    res.render('contacto');
});

// =========================================================================
// 2. RUTA DE BÚSQUEDA (Corregida a GET)
// =========================================================================

// Nota: La ruta duplicada router.get('/', ...) y la ruta POST /buscar
// han sido eliminadas y reemplazadas por esta única ruta GET /buscar
// para que coincida con tu formulario HTML.

router.get('/buscar', async (req, res) => {
    // CAPTURA CORREGIDA: Usamos req.query.q porque el formulario es GET y el campo es name="q"
    const searchTerm = req.query.q;

    try {
        if (!searchTerm) {
            // Si no hay término, redirige al inicio para evitar errores
            return res.redirect('/');
        }

        const libros = await searchBooks(searchTerm);

        // Renderiza en tu vista principal 'inicio', no en 'index'
        res.render('inicio', {
            pagina: `Resultados para "${searchTerm}"`,
            libros: libros,
            searchTerm: searchTerm
        });
    } catch (error) {
        console.error("Error al buscar libros en la API:", error.message);

        // Renderiza en tu vista principal 'inicio'
        res.render('inicio', {
            pagina: 'Error de Búsqueda',
            error: error.message,
            libros: [],
            searchTerm: searchTerm
        });
    }
});

export default router;