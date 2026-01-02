import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

const identificarUsuario = async (req, res, next) => {
    // 1. Mirar si hay token en las cookies
    const { _token } = req.cookies;

    if(!_token) {
        req.usuario = null;
        return next(); // Si no hay token, seguimos sin usuario
    }

    try {
        // 2. Comprobar que el token es válido
        const decoded = jwt.verify(_token, 'palabrasecreta');

        // 3. Buscar el usuario y pasarlo a la vista (res.locals)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if(usuario) {
            req.usuario = usuario;
            res.locals.usuarioLogueado = usuario; // <--- ESTA ES LA CLAVE PARA PUG
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default identificarUsuario;