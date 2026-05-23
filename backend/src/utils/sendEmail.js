const nodemailer = require("nodemailer");
const cron = require("node-cron");

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

// ─── Daily Email Limit Tracker ───────────────────────────────────────────────
const GMAIL_DAILY_LIMIT = 500;
const WARN_THRESHOLD = 0.8; // Warn at 80% usage (400 emails)

let emailCountToday = 0;
let warningAlreadySent = false; // Prevent repeated warning emails

/**
 * Reset counter every day at midnight (00:00).
 * Uses node-cron — already installed in this project.
 */
cron.schedule("0 0 * * *", () => {
  console.log(
    `[Email Tracker] Daily reset. Emails sent today: ${emailCountToday}. Counter reset to 0.`
  );
  emailCountToday = 0;
  warningAlreadySent = false;
});

/**
 * Send a self-notification email to the admin (EMAIL_USER) warning about limit.
 */
const sendLimitWarning = async (count) => {
  const percentage = Math.round((count / GMAIL_DAILY_LIMIT) * 100);
  try {
    await transporter.sendMail({
      from: `"DevTinder Alert" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Notify yourself
      subject: `⚠️ DevTinder: Gmail Limit Warning — ${percentage}% used (${count}/${GMAIL_DAILY_LIMIT})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff3cd; border-left: 5px solid #ff9800;">
          <h2 style="color: #e65100;">⚠️ Gmail Daily Send Limit Warning</h2>
          <p>Your DevTinder app has sent <strong>${count} out of ${GMAIL_DAILY_LIMIT}</strong> allowed emails today.</p>
          <p>That's <strong>${percentage}%</strong> of your daily Gmail SMTP limit.</p>
          <hr/>
          <p style="color: #555;">The counter resets automatically at <strong>midnight</strong>.</p>
          <p style="color: #555;">If you expect high email volume, consider switching to 
            <a href="https://sendgrid.com">SendGrid</a> (100 free/day) or 
            <a href="https://aws.amazon.com/ses/">AWS SES</a> (62,000 free/month on EC2).
          </p>
        </div>
      `,
    });
    console.warn(
      `[Email Tracker] ⚠️ Warning email sent to ${process.env.EMAIL_USER} — ${count}/${GMAIL_DAILY_LIMIT} emails used today.`
    );
  } catch (err) {
    console.error("[Email Tracker] Failed to send limit warning email:", err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

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
  // ── Limit Guard ──────────────────────────────────────────────────────────
  if (emailCountToday >= GMAIL_DAILY_LIMIT) {
    console.error(
      `[Email Tracker] 🚫 Daily Gmail limit of ${GMAIL_DAILY_LIMIT} reached. Email to "${to}" was NOT sent.`
    );
    throw new Error(
      `Daily Gmail send limit (${GMAIL_DAILY_LIMIT}) reached. Email blocked to protect your account.`
    );
  }

  const mailOptions = {
    from: `"DevTinder" <${process.env.EMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    ...(html ? { html } : { text }),
  };

  const info = await transporter.sendMail(mailOptions);
  emailCountToday++;

  console.log(
    `[Email] ✅ Sent: ${info.messageId} → ${mailOptions.to} | Daily count: ${emailCountToday}/${GMAIL_DAILY_LIMIT}`
  );

  // ── Warn at 80% threshold (only once per day) ────────────────────────────
  if (!warningAlreadySent && emailCountToday >= GMAIL_DAILY_LIMIT * WARN_THRESHOLD) {
    warningAlreadySent = true;
    sendLimitWarning(emailCountToday); // fire-and-forget (non-blocking)
  }

  return info;
};

module.exports = { sendEmail };
