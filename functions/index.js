const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const path = require("path");

functions.runWith({
  timeoutSeconds: 60,
  memory: "256MB",
});

const gmailEmail = process.env.GMAIL_EMAIL || functions.config().gmail.email;
const gmailPass = process.env.GMAIL_PASS || functions.config().gmail.pass;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass,
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName || "User";

  const mailOptions = {
    from: `"Foxorox" <${gmailEmail}>`,
    to: email,
    subject: "🎉 Welcome to Foxorox!",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #000; color: #fff;">
        <img src="cid:logo" alt="Foxorox Logo" style="width: 100px; margin-bottom: 20px;" />
        <h2 style="color: #f58220;">Hello ${displayName},</h2>
        <p>Welcome to <strong style="color: #f58220;">Foxorox</strong> – your AI-powered stock prediction platform.</p>
        <p>Your login email: <strong style="color: #fff;">${email}</strong></p>
        <p>We’re excited to have you onboard. 🚀</p>

        <p>If you need any help, feel free to reach out:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li>
            💼 
            <a href="https://foxorox.com/terms" style="color: #f58220;" target="_blank">
              Terms and Conditions:
            </a>
          </li>
          <li>
            📬 
            <a href="https://foxorox.com/contact" style="color: #f58220;" target="_blank">
              Contact Support:
            </a>
          </li>
        </ul>

        <p style="margin-top: 30px;">– The Foxorox Team 🦊</p>
      </div>
    `,
    attachments: [
      {
        filename: "cyborg.png",
        path: path.join(__dirname, "../public/cyborg.png"),
        cid: "logo",
      },
    ],
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log("✅ Welcome email sent to:", email);
    })
    .catch((error) => {
      console.error("❌ Email error:", error);
    });
});
