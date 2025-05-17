// routes/email.js
const express = require('express');
const nodemailer = require('nodemailer');
const emailNotification = express.Router();

emailNotification.post('/', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your email provider
      auth: {
        user: 'aakashkadiyan93@gmail.com',
        pass: 'kgtm rtpy ttdi tpge', // use app-specific password if using Gmail
      },
    });

    await transporter.sendMail({
      from: 'aakashkadiyan93@gmail.com',
      to,
      subject,
      text
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = emailNotification;
