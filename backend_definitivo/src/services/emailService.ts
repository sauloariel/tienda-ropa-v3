import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuración del transporter de email
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true para puerto 465, false para otros puertos
        auth: {
            user: process.env.SMTP_USER || 'tu-email@gmail.com',
            pass: process.env.SMTP_PASS || 'tu-contraseña-app'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Generar token de verificación único
export const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// Enviar email de verificación
export const sendVerificationEmail = async (
    email: string,
    nombre: string,
    token: string
): Promise<boolean> => {
    try {
        const transporter = createTransporter();

        // URL de verificación (ajustar según tu dominio)
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verificar-email?token=${token}`;

        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Tienda de Ropa'}" <${process.env.SMTP_USER || 'noreply@tienda.com'}>`,
            to: email,
            subject: 'Verifica tu cuenta - Tienda de Ropa',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verifica tu cuenta</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background-color: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 24px;
                            font-weight: bold;
                            color: #2563eb;
                            margin-bottom: 10px;
                        }
                        .title {
                            font-size: 28px;
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .content {
                            margin-bottom: 30px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #2563eb;
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .button:hover {
                            background-color: #1d4ed8;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                            font-size: 14px;
                            color: #6b7280;
                            text-align: center;
                        }
                        .warning {
                            background-color: #fef3c7;
                            border: 1px solid #f59e0b;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            color: #92400e;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🛍️ Tienda de Ropa</div>
                            <h1 class="title">¡Bienvenido, ${nombre}!</h1>
                        </div>
                        
                        <div class="content">
                            <p>Gracias por registrarte en nuestra tienda. Para completar tu registro y poder hacer compras, necesitas verificar tu dirección de correo electrónico.</p>
                            
                            <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
                            
                            <div style="text-align: center;">
                                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad.
                            </div>
                            
                            <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
                            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
                                ${verificationUrl}
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
                            <p>© 2025 Tienda de Ropa. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de verificación enviado:', info.messageId);
        return true;

    } catch (error) {
        console.error('❌ Error enviando email de verificación:', error);
        return false;
    }
};

// Enviar email de bienvenida después de verificación
export const sendWelcomeEmail = async (email: string, nombre: string): Promise<boolean> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Tienda de Ropa'}" <${process.env.SMTP_USER || 'noreply@tienda.com'}>`,
            to: email,
            subject: '¡Cuenta verificada exitosamente! - Tienda de Ropa',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cuenta verificada</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background-color: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 24px;
                            font-weight: bold;
                            color: #10b981;
                            margin-bottom: 10px;
                        }
                        .title {
                            font-size: 28px;
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .success {
                            background-color: #d1fae5;
                            border: 1px solid #10b981;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            color: #065f46;
                            text-align: center;
                        }
                        .button {
                            display: inline-block;
                            background-color: #10b981;
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                            font-size: 14px;
                            color: #6b7280;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">✅ Tienda de Ropa</div>
                            <h1 class="title">¡Cuenta verificada!</h1>
                        </div>
                        
                        <div class="success">
                            <strong>🎉 ¡Felicitaciones, ${nombre}!</strong><br>
                            Tu cuenta ha sido verificada exitosamente.
                        </div>
                        
                        <p>Ahora puedes:</p>
                        <ul>
                            <li>Iniciar sesión en tu cuenta</li>
                            <li>Realizar compras</li>
                            <li>Acceder a ofertas exclusivas</li>
                            <li>Gestionar tus pedidos</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Iniciar sesión</a>
                        </div>
                        
                        <div class="footer">
                            <p>¡Gracias por elegirnos!</p>
                            <p>© 2025 Tienda de Ropa. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de bienvenida enviado:', info.messageId);
        return true;

    } catch (error) {
        console.error('❌ Error enviando email de bienvenida:', error);
        return false;
    }
};

// Verificar configuración de email
export const testEmailConfiguration = async (): Promise<boolean> => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Configuración de email verificada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error en configuración de email:', error);
        return false;
    }
};
