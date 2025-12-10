//importamos express
import express from 'express';
import router from './route/index.js';


import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del archivo .env
//creamos la instancia
const app = express();

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


