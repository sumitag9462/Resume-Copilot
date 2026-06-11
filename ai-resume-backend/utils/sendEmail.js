const nodemailer = require('nodemailer');

const createTransporter = () => {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_SECURE
  } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    if (process.env.NODE_ENV === 'test' || process.env.SEND_EMAIL_DEBUG === 'true') {
      return null;
    }
    throw new Error(
      'SMTP is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS in your environment.'
    );
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: EMAIL_SECURE === 'true',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('[sendEmail] SMTP not configured. Skipping email delivery.');
    console.warn(`To: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(text);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};

module.exports = sendEmail;
