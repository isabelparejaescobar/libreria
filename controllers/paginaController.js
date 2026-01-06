import{Resenias} from "../models/Resenias.js";

const paginaInicio = async (req, res) => {

    // 1. Definimos una categoría para buscar
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&langRestrict=es&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

    try {
        // 2. Llamamos a la API
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const todosLosLibros = data.items || [];

        // 3. Mezclamos
        const librosMezclados = todosLosLibros.sort(() => 0.5 - Math.random());

        // 4. Cogemos los 3 primeros
        const librosRecomendados = librosMezclados.slice(0, 3);

        res.render('inicio', {
            pagina: 'Inicio',
            libros: librosRecomendados
        });

    } catch (error) {
        console.log(error);
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

const paginaOfertas = async (req, res) => {

    // CAMBIO RADICAL:
    // 1. Quitamos 'filter=free-ebooks' (Adiós libros viejos/feos).
    // 2. Buscamos 'subject:fiction' ordenado por 'relevance' (Los más famosos primero).
    // 3. printType=books para que no salgan revistas.

    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&langRestrict=es&printType=books&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        const libros = data.items || [];

        res.render('ofertas', {
            pagina: 'Mejores Ofertas',
            libros: libros
        });

    } catch (error) {
        console.log(error);
        res.render('ofertas', {
            pagina: 'Mejores Ofertas',
            libros: []
        });
    }
}
export {paginaInicio,
    paginaResenias,
    guardarResenias,
    paginaOfertas
};