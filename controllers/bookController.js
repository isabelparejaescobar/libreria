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

            // =========================================================
            // === CORRECCIÓN CLAVE: DECLARACIÓN Y ASIGNACIÓN DE 'books' ===
            // =========================================================
            const books = data.items.map(item => ({
                id: item.id,
                titulo: item.volumeInfo.title,
                autores: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Desconocido',
                fechaPublicacion: item.volumeInfo.publishedDate,
                descripcion: item.volumeInfo.description,
                // Agregamos la URL de la miniatura para mostrar en la vista
                imagen: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
                isbn_13: item.volumeInfo.industryIdentifiers
                    ? item.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier
                    : 'N/A',
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