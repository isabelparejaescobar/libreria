import Sequelize from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

//creamos la tabla usuario con los datos que necesitemos
export const Usuario = db.define('Usuario', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    hooks: {

        beforeCreate: async function(usuario) {
            //la sal es por si dos usuarios tienen la misma contraseña
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'token']
            }
        }
    }
});

//te ayuda a validar la contraseña que ya esta encriptada
Usuario.prototype.validarPassword = function(passwordFormulario) {
    return bcrypt.compareSync(passwordFormulario, this.password);
}