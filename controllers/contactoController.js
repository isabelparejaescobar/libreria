import dotenv from 'dotenv';

import nodemailer from "nodemailer";

const enviarCorreo = async (req, res) => {
    const { nombre, apellidos, email, telefono, mensaje } = req.body;

    if (!nombre || !apellidos || !email || !telefono || !mensaje) {
        return res.redirect('/contacto');
    }

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,      // ejemplo: isabelparejaescobar@gmail.com
            pass: process.env.GMAIL_APP_PASS   // contraseña de aplicación
        }
    });

    try {
        await transport.sendMail({
            from: `"Librería Node" <${process.env.USER_EMAIL}>`,
            to: email,
            subject: 'Hemos recibido tu mensaje correctamente',
            html: `
                <h1>¡Hola ${nombre}!</h1>
                <p>Hemos recibido tu mensaje.</p>
            `
        });

        res.redirect('/contacto');
    } catch (error) {
        console.error(error);
        res.redirect('/contacto');
    }
};

export {
    enviarCorreo
}