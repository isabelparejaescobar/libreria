import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

//nos conectamos a nuestra bbdd
const db = new Sequelize(

    //ocultamos la conexion
    process.env.CONEXION,
    {
        //no queremos que nos genere las columnas createdAt y updatedAt
        define: {
            timestamps: false
        },
        pool: {
            //maximo 5 conexiones simultaneas
            max: 5,
            //minimo 0
            min: 0,
            //tiempo maximo para conectarse
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: false
    }
);

export default db;