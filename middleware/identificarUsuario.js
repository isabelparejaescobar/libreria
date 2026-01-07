//jwt sirve para que cuando alguien se loguee generes un token con un id encriptado
//le permite entrar a la pagina sin tener que volver a poner la contraseña si se ha logueado
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

const identificarUsuario = async (req, res, next) => {
    //miro si hay token en las cookies
    const { _token } = req.cookies;

    //si no estas logueado
    if(!_token) {
        req.usuario = null;
        return next();
    }

    try {
        //Comprobar que el token es válido
        const decoded = jwt.verify(_token, 'palabrasecreta');

        //buscar el usuario y pasarlo a la vista
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if(usuario) {
            req.usuario = usuario;
            res.locals.usuarioLogueado = usuario;
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default identificarUsuario;