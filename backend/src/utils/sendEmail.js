const nodemailer = require("nodemailer");

/**
 * Creates a Nodemailer transporter using Gmail SMTP (App Password).
 * To use Gmail:
 *  1. Enable 2-Step Verification on your Google account.
 *  2. Generate an "App Password" at https://myaccount.google.com/apppasswords
 *  3. Set EMAIL_USER and EMAIL_PASS in your .env file.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular password)
  },
});

/**
 * Send an email.
 * @param {Object} options
 * @param {string|string[]} options.to       - Recipient email(s)
 * @param {string}          options.subject  - Email subject
 * @param {string}          [options.text]   - Plain-text body
 * @param {string}          [options.html]   - HTML body (used if provided)
 * @returns {Promise<Object>} Nodemailer info object
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"DevTinder" <${process.env.EMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    ...(html ? { html } : { text }),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Message sent: ${info.messageId} → ${mailOptions.to}`);
  return info;
};

module.exports = { sendEmail };
