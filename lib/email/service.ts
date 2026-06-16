import { sendEmailResend } from './resend'
import nodemailer from 'nodemailer'

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'
const EMAIL_FROM = process.env.EMAIL_FROM || 'vickamworkpro@gmail.com'
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'vickamworkpro@gmail.com'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SMTP_USER = process.env.EMAIL_SMTP_USER || 'vickamworkpro@gmail.com'
const SMTP_PASSWORD = process.env.EMAIL_SMTP_PASSWORD || process.env.GMAIL_PASSWORD || ''

if (!SMTP_PASSWORD) {
  console.warn('EMAIL SMTP password is not configured. Set EMAIL_SMTP_PASSWORD or GMAIL_PASSWORD in environment variables.')
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  fromName?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (EMAIL_PROVIDER === 'nodemailer') {
    return sendEmailNodemailer(options)
  }

  if (EMAIL_PROVIDER === 'resend') {
    return sendEmailResend(options)
  }

  if (EMAIL_PROVIDER === 'sendgrid') {
    return sendEmailSendGrid(options)
  }

  console.warn(`Unknown email provider: ${EMAIL_PROVIDER}`)
  return false
}

async function sendEmailNodemailer(options: EmailOptions): Promise<boolean> {
  if (!SMTP_PASSWORD) {
    console.error('SMTP password is not configured; email could not be sent.')
    return false
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: options.fromName ? `${options.fromName} <${EMAIL_FROM}>` : EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    return true
  } catch (error) {
    console.error('Error sending email with Nodemailer:', error)
    return false
  }
}

async function sendEmailSendGrid(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured')
    return false
  }

  if (!EMAIL_FROM) {
    console.error('EMAIL_FROM is not configured')
    return false
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: { email: EMAIL_FROM, name: options.fromName || 'AMTMTI' },
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('SendGrid error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email with SendGrid:', error)
    return false
  }
}

export { EMAIL_FROM, COMPANY_EMAIL }
