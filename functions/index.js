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
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000" style="font-family: Arial, sans-serif; color: #f0f0f0; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <a href="https://foxorox.com/" target="_blank">
                    <img src="cid:logo" alt="Foxorox Logo" width="120" style="display: block;" />
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="color: #f58220; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
                  Welcome aboard, ${displayName}!
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size: 16px; padding-bottom: 30px;">
                  <strong style="color: #f58220;">Foxorox</strong><br /><br />
                  <span style="color: #f58220;">Your login email:</span> <a href="mailto:${email}" style="color: #007bff; text-decoration: underline;">${email}</a><br /><br />
                  Our intelligent models analyze thousands of market signals so you don’t have to — just sit back and let the data work for you.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px 0; border-top: 1px solid #333;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="font-size: 14px; color: #ccc;">
                        Need help? Reach out to us anytime:
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 10px;">
                        💼 <a href="https://foxorox.com/terms" target="_blank" style="color: #f58220; text-decoration: none;">Terms and Conditions</a>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        📬 <a href="https://foxorox.com/contact" target="_blank" style="color: #f58220; text-decoration: none;">Contact Support</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size: 16px; color: #f58220; font-weight: bold; padding-top: 40px;">
                  Socials
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 10px;">
                  <a href="https://x.com/FoxoroxAI" target="_blank" style="text-decoration: none; color: #f0f0f0;">
                    <img src="cid:xlogo" alt="X" width="32" height="32" style="vertical-align: middle; margin-right: 10px;" />
                    @FoxoroxAI
                  </a>
                </td>
              </tr>

              <!-- Footer Section with 2 columns -->
              <tr>
                <td style="padding-top: 60px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="left" width="50%" style="padding-left: 20px;">
                        <a href="https://exante.eu/p/39551/" target="_blank">
                          <img src="cid:exante" alt="Exante Logo" width="100" style="display: block;" />
                        </a>
                        <p style="color: #f58220; font-size: 13px; margin-top: 5px;">Partnered with Exante</p>
                      </td>
                      <td align="right" width="50%" style="padding-right: 20px;">
                        <a href="https://foxorox.com/" target="_blank">
                          <img src="cid:foxoroxsmall" alt="Foxorox Logo Small" width="60" style="display: block; margin-bottom: 5px;" />
                        </a>
                        <p style="color: #f58220; font-size: 13px;">Foxorox Team<br />Click to Launch</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
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
      {
        filename: "foxorox.png",
        path: path.join(__dirname, "/public/foxorox.png"),
        cid: "foxoroxsmall",
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
