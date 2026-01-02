// controllers/bookController.js

import axios from 'axios';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(searchTerm) {

    if (!searchTerm) {
        return [];
    }

    const params = {
        q: searchTerm,
        maxResults: 20,
        key: API_KEY
    };

    try {
        console.log(`[LOG] Búsqueda iniciada para: ${searchTerm}`);

        const response = await axios.get(API_URL, { params });
        const data = response.data;

        // =========================================================
        // === ZONA CRÍTICA DE DEBUGGING === (Funciona, mantengo los logs)
        // =========================================================

        if (data.items) {
            console.log(`[LOG] API Status: OK. Items encontrados: ${data.items.length}`);
            if (data.items.length > 0) {
                console.log(`[LOG] Primer Título (de la API): ${data.items[0].volumeInfo.title}`);
            }
        } else {
            console.warn(`[LOG] ADVERTENCIA: API respondió OK (200) pero no hay 'items'.`);
        }

        // =========================================================

        if (data.items && data.items.length > 0) {

            const books = data.items.map(item => ({
                id: item.id,
                titulo: item.volumeInfo.title,
                autores: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Desconocido',
                fechaPublicacion: item.volumeInfo.publishedDate,
                imagen: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
                isbn_13: item.volumeInfo.industryIdentifiers
                    ? item.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier
                    : 'N/A',
                precio: item.saleInfo && item.saleInfo.listPrice
                    ? `${item.saleInfo.listPrice.amount} ${item.saleInfo.listPrice.currencyCode}`
                    : 'No disponible / Gratis',
                linkCompra: item.saleInfo ? item.saleInfo.buyLink : null,
                // Puedes añadir más campos si los necesitas
            }));

            return books; // Aquí se resuelve el error: 'books' está definido y se devuelve.

        } else {
            return [];
        }

    } catch (error) {
        console.error("[LOG] ERROR DE API/AXIOS. Esto es un fallo de conexión o clave.");
        console.error(`Status de error: ${error.response?.status || 'No disponible'}`);
        console.error(`Mensaje: ${error.message}`);

        // Relanzamos el error para que sea manejado por el router y se muestre en la vista
        throw new Error('Fallo en la conexión con el servicio de Google Books. (Revisar clave/cuota)');
    }
}

// ... (Tu código anterior de imports y searchBooks) ...

/**
 * Obtiene los detalles de un libro específico por su ID
 * @param {string} id - El ID del volumen de Google Books
 */
export async function getBookDetails(id) {
    const url = `${API_URL}/${id}`;
    const params = { key: API_KEY };

    try {
        const response = await axios.get(url, { params });
        const item = response.data;
        const info = item.volumeInfo;
        const sale = item.saleInfo;

        // Mapeamos un objeto con TODOS los detalles para la ficha técnica
        const bookDetail = {
            id: item.id,
            titulo: info.title,
            subtitulo: info.subtitle || '',
            autores: info.authors ? info.authors.join(', ') : 'Desconocido',
            descripcion: info.description || 'Sin descripción disponible.',
            fechaPublicacion: info.publishedDate,
            editorial: info.publisher || 'Desconocido',
            paginas: info.pageCount || 'N/A',
            categorias: info.categories ? info.categories.join(', ') : 'General',
            idioma: info.language,
            imagen: info.imageLinks ? (info.imageLinks.large || info.imageLinks.thumbnail) : null,
            // Precios
            precio: sale && sale.listPrice
                ? `${sale.listPrice.amount} ${sale.listPrice.currencyCode}`
                : 'No disponible / Gratis',
            linkCompra: sale ? sale.buyLink : null,
            estadoVenta: sale ? sale.saleability : 'UNKNOWN',
            isbn: info.industryIdentifiers
                ? info.industryIdentifiers.map(i => `${i.type}: ${i.identifier}`).join(', ')
                : 'N/A'
        };

        return bookDetail;

    } catch (error) {
        console.error("Error obteniendo detalles del libro:", error.message);
        throw new Error('No se pudo cargar la ficha del libro.');
    }
}