import nodemailer from 'nodemailer';
import { getSupportEmail } from './service';

interface EmailOptions {
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
}

export async function sendConfirmationEmail(
  toEmail: string, // 👈 This is the argument passed from your enrollment route
  subject: string,
  htmlContent: string,
  options?: EmailOptions
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'vickamworkpro@gmail.com',
        pass: process.env.SMTP_PASS, // Your App Password
      },
    });

    const fromName = options?.fromName || 'AMTMTI Admissions';
    const fromEmail = options?.fromEmail || getSupportEmail();
    const replyTo = options?.replyTo || getSupportEmail();

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail, // ❌ Previously hardcoded to an admin email. Fixed to use the argument dynamically.
      replyTo: replyTo,
      subject: subject,
      html: htmlContent,
    });

    return !!info.messageId;
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return false;
  }
}