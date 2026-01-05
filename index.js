import dotenv from 'dotenv';



//importamos express
import express from 'express';
import router from './route/index.js';
import db from './config/db.js';
import './models/Resenias.js';
import cookieParser from 'cookie-parser';
import identificarUsuario from './middleware/identificarUsuario.js';

dotenv.config(); // Carga las variables del archivo .env
//creamos la instancia
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //habilitamos la lectura de cookies
app.use(identificarUsuario);
app.use(express.json());

//conectamos a la bbdd
db.authenticate()
    .then(() => db.sync())
    .then(() => console.log('Conectado a la BBDD y tablas creadas'))
    .catch((err) => console.log('Error de conexión:', err));

//definimos el puerto
const port = process.env.PORT || 4000;

//habilitamos pug
app.set('view engine', 'pug');


//obtener el año actual
app.use((req,res,next)=>{
    const year= new Date().getFullYear();
    res.locals.year = year;
    res.locals.nombreP = 'libreria';
    next();
});

//agregar router
app.use('/', router);

//definimos la carpeta publica
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


