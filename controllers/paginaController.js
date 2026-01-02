import{Resenias} from "../models/Resenias.js";

const paginaInicio = async (req, res) => {

    // 1. Definimos una categoría para buscar (ej: 'subject:fiction' o 'best sellers')
    // Pedimos 20 resultados para tener variedad donde elegir
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&langRestrict=es&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

    try {
        // 2. Llamamos a la API
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const todosLosLibros = data.items || [];

        // 3. LA MAGIA: Desordenamos el array aleatoriamente
        // El sort con Math.random() mezcla los elementos como una baraja de cartas
        const librosMezclados = todosLosLibros.sort(() => 0.5 - Math.random());

        // 4. Cogemos solo los 3 primeros de la lista mezclada
        const librosRecomendados = librosMezclados.slice(0, 3);

        res.render('inicio', {
            libros: librosRecomendados
        });

    } catch (error) {
        console.log(error);
        // Si falla la API, cargamos la página sin libros para que no explote
        res.render('inicio', {
            pagina: 'Inicio',
            libros: []
        });
    }
}
const paginaResenias= async (req, res) => {

    try{
        const resenias=await Resenias.findAll({
            limit: 6,
            order: [["Id","DESC"]],
        });
        res.render("resenias", {
            pagina: 'Reseñas',
            resenias: resenias,
        });
    } catch (error) {
        console.log(error);
    }

}

const guardarResenias = async (req, res) => {

    const{nombre,correoelectronico,mensaje} = req.body;

    const errores=[];

    //si alguno de los valores estan vacios
    if(nombre.trim()===''){
        errores.push('El nombre es requerido');
    }

    if(correoelectronico.trim()===''){
        errores.push('El correo es requerido');
    }

    if(mensaje.trim()===''){
        errores.push('El mensa es requerido');
    }

    //volvemos a la vista para mostrar el error
    if(errores.length>0){

        const resenias= await Resenias.findAll({
            limit: 6,
            order: [["Id","DESC"]],

        });

        res.render("resenias", {
            pagina: 'Resenias',
            errores: errores,
            nombre: nombre,
            correoelectronico: correoelectronico,
            mensaje: mensaje,
            resenias: resenias,
        })
    } else {//almacenar en la bbdd
        try{
            await Resenias.create( { nombre: nombre, correoelectronico: correoelectronico, mensaje: mensaje, });
            res.redirect('/resenias');
        } catch(error){
            console.log(error);
        }

    }
}

export {paginaInicio,
    paginaResenias,
    guardarResenias,
};