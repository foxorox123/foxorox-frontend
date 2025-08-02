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
      <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #000; color: #ffffff; padding: 40px 20px; text-align: center;">
        <img src="cid:logo" alt="Foxorox Logo" style="width: 120px; margin-bottom: 30px;" />

        <h2 style="color: #f58220; font-size: 24px; margin-bottom: 10px;">Welcome aboard, ${displayName}!</h2>

        <p style="font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #ffffff;">
          We're thrilled to have you join <strong style="color: #f58220;">Foxorox</strong>, your go-to platform for AI-powered stock prediction.
          <br /><br />
          <strong style="color: #f58220;">Your login email:</strong>
          <span style="color: #ffffff;">${email}</span>
          <br /><br />
          Our intelligent models analyze thousands of market signals so you don't have to — just sit back and let the data work for you.
        </p>

        <div style="margin: 40px auto 30px; max-width: 600px; border-top: 1px solid #333;"></div>

        <div style="font-size: 14px; color: #ccc;">
          <p style="margin-bottom: 8px;">Need help? Reach out to us anytime:</p>
          <p style="line-height: 1.8;">
            💼 <a href="https://foxorox.com/terms" style="color: #ffffff; text-decoration: underline;" onmouseover="this.style.color='#f58220'" onmouseout="this.style.color='#ffffff'" target="_blank">Terms and Conditions</a> &nbsp; | &nbsp;
            📬 <a href="https://foxorox.com/contact" style="color: #ffffff; text-decoration: underline;" onmouseover="this.style.color='#f58220'" onmouseout="this.style.color='#ffffff'" target="_blank">Contact Support</a>
          </p>
        </div>

        <div style="margin: 60px auto 10px; font-size: 16px; font-weight: bold; color: #f58220;">Socials</div>
        <div style="margin-top: 15px;">
          <a href="https://x.com/FoxoroxAI" target="_blank" style="text-decoration: none; color: #ffffff; display: inline-flex; align-items: center;" onmouseover="this.style.color='#f58220'" onmouseout="this.style.color='#ffffff'">
            <img src="cid:xlogo" alt="X" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 10px;" />
            <span style="font-size: 16px;">@FoxoroxAI</span>
          </a>
        </div>

        <div style="margin-top: 50px;">
          <p style="font-size: 16px; color: #f58220; margin-bottom: 10px;">
            <strong>💹 Trade smarter with Foxorox AI and Exante</strong>
          </p>
          <a href="https://exante.eu/p/39551/" target="_blank">
            <img
              src="cid:exante"
              alt="Exante Logo"
              style="width: 140px; margin-bottom: 10px; transition: transform 0.3s ease;"
              onmouseover="this.style.transform='scale(1.1)'"
              onmouseout="this.style.transform='scale(1)'"
            />
          </a>
        </div>

        <p style="margin-top: 60px; color: #f58220;">– The Foxorox Team 🦊</p>
      </div>
    `,
    attachments: [
      {
        filename: "cyborg.png",
        path: path.join(__dirname, "/public/cyborg.png"),
        cid: "logo",
      },
      {
        filename: "x.png",
        path: path.join(__dirname, "/public/x.png"),
        cid: "xlogo",
      },
      {
        filename: "exante.png",
        path: path.join(__dirname, "/public/exante.png"),
        cid: "exante",
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
