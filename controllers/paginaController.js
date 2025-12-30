import{Resenias} from "../models/Resenias.js";

const paginaInicio= async (req, res) => {

    const promiseDB=[];
    promiseDB.push(Resenias.findAll({
        limit:3,
        order: [["Id","DESC"]],
    }));

    try{
        const resultado= await Promise.all(promiseDB) ;

        res.render("inicio", {
            clase: 'home',
            testimonios: resultado[1],
        });
    } catch(err){
        console.error(err);
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