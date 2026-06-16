import { sendEmailResend } from './resend'
import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  fromName?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || 'nodemailer'

  if (provider === 'nodemailer') {
    return sendEmailNodemailer(options)
  }

  if (provider === 'resend') {
    return sendEmailResend(options)
  }

  if (provider === 'sendgrid') {
    return sendEmailSendGrid(options)
  }

  console.warn(`Unknown email provider: ${provider}`)
  return false
}

async function sendEmailNodemailer(options: EmailOptions): Promise<boolean> {
  const smtpUser = process.env.EMAIL_SMTP_USER || process.env.EMAIL_FROM || ''
  const smtpPassword = process.env.EMAIL_SMTP_PASSWORD || process.env.GMAIL_PASSWORD || ''
  const emailFrom = process.env.EMAIL_FROM || smtpUser

  if (!smtpPassword) {
    console.error('SMTP password is not configured. Set EMAIL_SMTP_PASSWORD or GMAIL_PASSWORD.')
    return false
  }

  if (!smtpUser) {
    console.error('SMTP user is not configured. Set EMAIL_SMTP_USER.')
    return false
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    await transporter.sendMail({
      from: options.fromName ? `${options.fromName} <${emailFrom}>` : emailFrom,
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
  const apiKey = process.env.SENDGRID_API_KEY
  const emailFrom = process.env.EMAIL_FROM || ''

  if (!apiKey) {
    console.error('SendGrid API key not configured')
    return false
  }

  if (!emailFrom) {
    console.error('EMAIL_FROM is not configured')
    return false
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: { email: emailFrom, name: options.fromName || 'AMTMTI' },
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

export const EMAIL_FROM = process.env.EMAIL_FROM || 'vickamworkpro@gmail.com'
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'vickamworkpro@gmail.com'
