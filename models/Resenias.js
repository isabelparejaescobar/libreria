import Sequelize from 'sequelize';
import db from '../config/db.js';

//creamos la tabla resenias con los datos que necesitemos
export const Resenias = db.define('resenias', {
    nombre: {
        type: Sequelize.STRING,
    },

    correoelectronico: {
        type: Sequelize.STRING,
    },
    mensaje:{
        type: Sequelize.STRING,
    }
}, {
    timestamps: false
});