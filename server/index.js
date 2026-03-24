import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({ origin: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

const contactTo = process.env.CONTACT_TO || 'info@7factors.co';
const from = process.env.SMTP_FROM || '7 Factors Contact <noreply@7factors.co>';

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const mailSubject = (subject && String(subject).trim()) || '7 Factors – Contact';
  const text = [
    `Name: ${(name || '').trim()}`,
    `Email: ${(email || '').trim()}`,
    '',
    message ? `Message:\n${String(message).trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await transporter.sendMail({
      from,
      to: contactTo,
      replyTo: email.trim(),
      subject: mailSubject,
      text,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// On Hostinger (and similar): serve Angular build from server/public so one app does everything
const publicDir = path.join(__dirname, 'public');
if (isProduction) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  if (isProduction) console.log('Serving static site from', publicDir);
});
