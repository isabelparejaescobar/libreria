//node nos permite enviar correos sin tener que tratar con los protocolos de SMTP
import nodemailer from "nodemailer";

const enviarCorreo = async (req, res) => {
    const { nombre, apellidos, email, telefono, mensaje } = req.body;

    // comprueba que no falte ningun dato
    if (!nombre || !apellidos || !email || !telefono || !mensaje) {
        res.redirect('/contacto');
        return;
    }

    //GENERAMOS UNA CONTRASEÑA DE APLICACION PARA EL CORREO

    //se encarga de gestionar la conexion SMTP para enviar correos
    const transport = nodemailer.createTransport({
        service: 'gmail',
        //estas dos lineas se ignoran
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        //credenciales
        auth: {
            //user que uso
            user: process.env.user,
            //contraseña de aplicacion
            pass: process.env.contrasenia_correo,
        }
    });

    //aqui he consigurado el correo que recibe la persona
    try {
        await transport.sendMail({
            //de la cuenta que lo recibe
            from: 'isabelparejaescobar@gmail.com',
            //el email al que lo mandamos
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