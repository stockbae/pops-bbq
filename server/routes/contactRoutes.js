import express from 'express';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    first_name = '',
    last_name = '',
    email = '',
    phone = '',
    reservation_date = '',
    subject = '',
    message = '',
  } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields (email, message)' });
  }

  const fullName = `${first_name} ${last_name}`.trim();
  const mailSubject = subject || 'Website contact';
  const textBody = `From: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nReservation Date: ${reservation_date}\n\n${message}`;
  const htmlBody = `<p><strong>From:</strong> ${fullName}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Reservation Date:</strong> ${reservation_date}</p>
  <hr>
  <p>${message.replace(/\n/g, '<br>')}</p>`;

  try {
    // If SENDGRID_API_KEY is provided, use SendGrid for delivery
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: process.env.CONTACT_DESTINATION || 'bolajoka@matc.edu',
        from: process.env.CONTACT_FROM || process.env.CONTACT_DESTINATION || 'bolajoka@matc.edu',
        subject: mailSubject,
        text: textBody,
        html: htmlBody,
        replyTo: email,
      };

      const sendResult = await sgMail.send(msg);
      // sendResult is an array for single message; try to extract message-id from headers if available
      const messageId = (sendResult && sendResult[0] && sendResult[0].headers && sendResult[0].headers['x-message-id']) || null;
      return res.json({ ok: true, provider: 'sendgrid', messageId });
    }

    // Fallback: use nodemailer (SMTP or Ethereal)
    let transporter;
    let usingTestAccount = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // fallback: create Ethereal test account
      const testAccount = await nodemailer.createTestAccount();
      usingTestAccount = true;
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `${fullName || 'Website Visitor'} <${email}>`,
      to: process.env.CONTACT_DESTINATION || 'bolajoka@matc.edu',
      subject: mailSubject,
      text: textBody,
      html: htmlBody,
    });

    const response = { ok: true, messageId: info.messageId };
    if (usingTestAccount) {
      response.preview = nodemailer.getTestMessageUrl(info) || null;
    }

    return res.json(response);
  } catch (err) {
    console.error('Error sending contact email:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
