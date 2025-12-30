import nodemailer from "nodemailer";
import dotenv from 'dotenv';

const enviarCorreo = async (req, res) => {
    const { nombre, apellidos, email, telefono, mensaje } = req.body;

    // Validación
    if (!nombre || !apellidos || !email || !telefono || !mensaje) {
        res.redirect('/contacto');
        return;
    }

    const transport = nodemailer.createTransport({
        service: 'gmail',
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.user,
            pass: process.env.contrasenia_correo,
        }
    });

    try {
        await transport.sendMail({
            from: 'isabelparejaescobar@gmail.com',
            to: email,
            subject: 'Hemos recibido tu mensaje correctamente',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h1 style="color: #007bff;">¡Hola ${nombre}!</h1>
                    <p>Gracias por contactar con <strong>Librería Node</strong>.</p>
                    <p>Hemos recibido tu consulta y nos pondremos en contacto contigo en breve.</p>
                    <hr>
                    <p><small>Este es un correo automático, por favor no respondas a esta dirección.</small></p>
                </div>
            `
        });

        res.redirect('/contacto');

    } catch (error) {
        console.log(error);
        res.redirect('/contacto');
    }
}

export {
    enviarCorreo
}