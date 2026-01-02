const obtenerRespuestaChat = async (req, res) => {
    const { mensaje } = req.body;
    const msg = mensaje.toLowerCase();

    let terminoBusqueda = '';
    let respuestaTexto = '';

    // --- LÓGICA DEL BOT (DETECTAR PALABRAS CLAVE) ---
    if (msg.includes('hola') || msg.includes('buenos')) {
        return res.json({
            reply: "¡Hola! Soy el asistente virtual. Pídeme recomendaciones, por ejemplo: 'Busco libros de terror' o 'Algo de romance'."
        });
    } else if (msg.includes('romance') || msg.includes('amor')) {
        terminoBusqueda = 'subject:romance';
        respuestaTexto = '¡Qué romántico! Mira estos libros de amor:';
    } else if (msg.includes('miedo') || msg.includes('terror')) {
        terminoBusqueda = 'subject:horror';
        respuestaTexto = '¡Uy, qué miedo! Aquí tienes algunos de terror:';
    } else if (msg.includes('ficcion') || msg.includes('aventura')) {
        terminoBusqueda = 'subject:fiction';
        respuestaTexto = 'Grandes aventuras te esperan con estos libros:';
    } else if (msg.includes('cocina') || msg.includes('recetas')) {
        terminoBusqueda = 'subject:cooking';
        respuestaTexto = '¡Para chuparse los dedos! Libros de cocina:';
    } else {
        return res.json({
            reply: "Lo siento, no entendí bien. Prueba diciéndome géneros como: romance, terror, cocina o ficción."
        });
    }

    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${terminoBusqueda}&langRestrict=es&maxResults=3&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const libros = data.items || [];

        // Preparamos una respuesta bonita con HTML para el chat
        let htmlLibros = `<p>${respuestaTexto}</p>`;

        libros.forEach(libro => {
            const titulo = libro.volumeInfo.title;
            const img = libro.volumeInfo.imageLinks ? libro.volumeInfo.imageLinks.thumbnail : '';
            const link = libro.volumeInfo.infoLink;

            if(img) {
                htmlLibros += `
                    <div style="display:flex; gap:10px; margin-top:10px; background:#f9f9f9; padding:5px; border-radius:5px;">
                        <img src="${img}" style="width:40px; height:60px;">
                        <div>
                            <small style="font-weight:bold; display:block;">${titulo.substring(0, 30)}...</small>
                            <a href="${link}" target="_blank" style="font-size:10px; color:blue;">Ver libro</a>
                        </div>
                    </div>
                `;
            }
        });

        res.json({ reply: htmlLibros });

    } catch (error) {
        console.log(error);
        res.json({ reply: "Ups, tuve un error conectando con la biblioteca." });
    }
}

export { obtenerRespuestaChat };