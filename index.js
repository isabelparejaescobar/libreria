//importamos express
import express from 'express';

//creamos la instancia
const app = express();

//definimos el puerto
const port = process.env.PORT || 4000;

//pagina principal
app.get('/', (req , res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
