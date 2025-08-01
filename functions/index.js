const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Konfiguracja środowiska
functions.runWith({ timeoutSeconds: 60, memory: "256MB" });

const gmailEmail = process.env.GMAIL_EMAIL || functions.config().gmail.email;
const gmailPass = process.env.GMAIL_PASS || functions.config().gmail.pass;

// Konfiguracja SMTP Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});

// Funkcja wywoływana przy rejestracji użytkownika
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName || "User";

  const mailOptions = {
    from: `"Foxorox" <${gmailEmail}>`,
    to: email,
    subject: "🎉 Welcome to Foxorox!",
    html: `
      <div style="background-color: #000; color: #fff; font-family: 'Segoe UI', sans-serif; padding: 40px; text-align: center;">
        <img src="https://foxorox.com/cyborg.png" alt="Foxorox Logo" style="width: 100px; margin-bottom: 20px;" />
        <h2 style="color: #f58220; margin-bottom: 10px;">Hello ${displayName},</h2>
        <p style="font-size: 16px; color: #ccc; max-width: 600px; margin: 0 auto 20px;">
          Welcome to <strong>Foxorox</strong> – your AI-powered stock prediction platform.
        </p>
        <p style="font-size: 15px; color: #ccc; margin-bottom: 20px;">
          We’re thrilled to have you on board. Our platform is built to process thousands of stock data points using advanced machine learning – just give it a few minutes after launch.
        </p>
        <p style="font-size: 14px; color: #aaa;">
          Need help? Contact us anytime at 
          <a href="mailto:noreply.foxorox@gmail.com" style="color: #f58220; text-decoration: none;">noreply.foxorox@gmail.com</a>
        </p>
        <p style="margin-top: 40px; font-size: 14px; color: #555;">– The Foxorox Team 🦊</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log("✅ Welcome email sent to:", email);
    })
    .catch((error) => {
      console.error("❌ Email error:", error);
    });
});
