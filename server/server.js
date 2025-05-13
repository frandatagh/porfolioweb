require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para envío de correo
app.post("/send-email", async (req, res) => {
  const { from_name, subject, message } = req.body;

  if (!from_name || !subject || !message) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje: ${subject}`,
      text: `Nombre: ${from_name}\nMensaje:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});