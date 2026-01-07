//instalamos la libreria de groq
import Groq from "groq-sdk";

const obtenerRespuestaChat = async (req, res) => {
    const { mensaje } = req.body;

    try {
        //ponemos la clave de la api que hemos generado que esta oculta en el env
        const groq = new Groq({ apiKey: process.env.GROK_API });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    //consiguramos el bot
                    //le damos todo el contesto o contenido del que debe hablar
                    role: "system",
                    content: `Eres un bibliotecario experto, culto y MUY PRECISO con los géneros literarios.
                    
                    TU OBJETIVO: Recomendar libros que sean REALMENTE parecidos en trama, tono y género a lo que pide el usuario.
                    NO RESPONDAS COSAS QUE NO TENGAN NADA QUE VER CON LIBROS O RECOMENDACIONES, NO TIENES CAPACIDAD DE HACER NADA MAS QUE RECOMENDAR LIBROS
                    
                    REGLAS ESTRICTAS DE RECOMENDACIÓN:
                    1. Si piden Fantasía Juvenil (ej: El Príncipe Cruel), NO recomiendes erótica ni libros de adultos (como 50 sombras). Busca libros de hadas, magia o cortes reales (ej: Una Corte de Rosas y Espinas, Los Juegos del Hambre).
                    2. Si piden Terror, busca libros de miedo real (Stephen King, Lovecraft), no thrillers suaves.
                    3. Si piden algo específico (ej: "romance de oficina"), ciñete a eso.

                    FORMATO DE RESPUESTA (JSON):
                    SI ES CHARLA: { "tipo": "chat", "texto": "Respuesta amable..." }
                    SI ES RECOMENDACIÓN: 
                    {
                        "tipo": "recomendacion",
                        "texto": "Aquí tienes libros con un estilo muy similar:",
                        "libros": [
                            { "titulo": "Título", "autor": "Autor", "sinopsis": "Por qué se parece a lo que pediste." }
                        ]
                    }

                    IMPORTANTE: Responde solo JSON sin markdown.`
                },
                { role: "user", content: mensaje }
            ],
            //el modelo que estoy usando en este caso
            //controlamos la temperatura para que sea precisa y no se invente cosas
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        // limpieza y respuesta
        let content = chatCompletion.choices[0].message.content;
        const limpiarJSON = (str) => str.replace(/```json/g, '').replace(/```/g, '').trim();
        const respuestaIA = JSON.parse(limpiarJSON(content));

        if (respuestaIA.tipo === 'chat') {
            return res.json({ reply: `<p>${respuestaIA.texto}</p>` });
        }

        let htmlRespuesta = `<p class="mb-2">${respuestaIA.texto}</p>`;

        //le damos estilo a la respuesta
        if (respuestaIA.libros && respuestaIA.libros.length > 0) {
            respuestaIA.libros.forEach(libro => {
                const imgGenerica = 'https://cdn-icons-png.flaticon.com/512/3330/3330314.png';
                htmlRespuesta += `
                    <div style="display:flex; gap:12px; margin-bottom:12px; background:#fff; padding:10px; border-radius:10px; border:1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <img src="${imgGenerica}" style="width:45px; height:45px; object-fit:contain; opacity:0.7;">
                        <div>
                            <div style="font-weight:bold; color:#2c3e50; line-height:1.2;">${libro.titulo}</div>
                            <div style="font-size:0.85rem; color:#4f46e5; margin-bottom:2px;">${libro.autor}</div>
                            <div style="font-size:0.8rem; color:#666; font-style:italic;">"${libro.sinopsis}"</div>
                        </div>
                    </div>
                `;
            });
        }
        res.json({ reply: htmlRespuesta });

    } catch (error) {
        console.error("Error Chat:", error);
        res.json({ reply: "Estoy afinando mi brújula literaria. Inténtalo de nuevo." });
    }
}

export { obtenerRespuestaChat };