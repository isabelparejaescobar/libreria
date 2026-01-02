import Sequelize from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

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

Usuario.prototype.validarPassword = function(passwordFormulario) {
    return bcrypt.compareSync(passwordFormulario, this.password);
}