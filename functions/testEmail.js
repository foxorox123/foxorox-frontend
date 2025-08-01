const nodemailer = require("nodemailer");

// WPROWADŹ swoje dane GMAIL + APP PASSWORD
const gmailEmail = "noreply.foxorox@gmail.com";
const gmailPass = "jscm mfmj gyxx wcki";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});

const mailOptions = {
  from: `"Foxorox" <${gmailEmail}>`,
  to: "aerga.pl@gmail.com", // <- tutaj wpisz swój adres do testu
  subject: "Test – Nodemailer z App Password",
  html: `
    <h2 style="color: #f58220;">Działa! 🎉</h2>
    <p>To testowy e-mail wysłany z <strong>Nodemailer</strong> i Gmail App Password.</p>
    <p>Jeśli to widzisz, wszystko działa 👍</p>
  `,
};

transporter.sendMail(mailOptions)
  .then(() => {
    console.log("✅ E-mail został wysłany.");
  })
  .catch((error) => {
    console.error("❌ Błąd przy wysyłaniu:", error);
  });
