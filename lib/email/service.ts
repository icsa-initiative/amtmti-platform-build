import { sendEmailResend } from './resend'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  fromName?: string
  fromEmail?: string
  replyTo?: string
}

const runtimeEnvCache = new Map<string, string>()

function readRuntimeEnvValue(key: string) {
  if (runtimeEnvCache.has(key)) {
    return runtimeEnvCache.get(key)
  }

  const envFiles = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env.production'),
    path.join(process.cwd(), '.env'),
  ]

  for (const envFile of envFiles) {
    if (!fs.existsSync(envFile)) {
      continue
    }

    const contents = fs.readFileSync(envFile, 'utf8')
    const line = contents
      .split(/\r?\n/)
      .find((entry) => entry.startsWith(`${key}=`))

    if (!line) {
      continue
    }

    const rawValue = line.slice(key.length + 1).trim()
    const unquoted = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
    runtimeEnvCache.set(key, unquoted)
    return unquoted
  }

  runtimeEnvCache.set(key, '')
  return ''
}

function env(key: string) {
  return process.env[key] || readRuntimeEnvValue(key)
}

function resolveEmailProvider() {
  const provider = env('EMAIL_PROVIDER')?.trim().toLowerCase()

  if (provider) {
    return provider
  }

  if (env('RESEND_API_KEY')) {
    return 'resend'
  }

  if (env('SENDGRID_API_KEY')) {
    return 'sendgrid'
  }

  return 'nodemailer'
}

export function getSupportEmail() {
  return (
    env('COMPANY_EMAIL') ||
    env('NEXT_PUBLIC_AMTMTI_EMAIL') ||
    'info@amtmti.africa'
  )
}

export function getSenderEmail() {
  return (
    env('EMAIL_FROM') ||
    env('EMAIL_SMTP_USER') ||
    getSupportEmail()
  )
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const provider = resolveEmailProvider()

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
  const smtpUser = env('EMAIL_SMTP_USER') || env('EMAIL_FROM') || ''
  const smtpPassword = env('EMAIL_SMTP_PASSWORD') || env('GMAIL_PASSWORD') || ''
  const smtpHost = env('EMAIL_SMTP_HOST') || 'smtp.gmail.com'
  const smtpPort = Number(env('EMAIL_SMTP_PORT') || '465')
  const smtpSecure =
    env('EMAIL_SMTP_SECURE') != null
      ? env('EMAIL_SMTP_SECURE') === 'true'
      : smtpPort === 465
  const replyTo = options.replyTo || options.fromEmail || getSupportEmail()

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
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    await transporter.sendMail({
      from: {
        name: options.fromName || 'AMTMTI',
        address: smtpUser,
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo,
    })

    return true
  } catch (error) {
    console.error('Error sending email with Nodemailer:', error)
    return false
  }
}

async function sendEmailSendGrid(options: EmailOptions): Promise<boolean> {
  const apiKey = env('SENDGRID_API_KEY')
  const emailFrom = options.fromEmail || getSupportEmail()
  const replyTo = options.replyTo || getSupportEmail()

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
        reply_to: replyTo
          ? {
              email: replyTo,
              name: options.fromName || 'AMTMTI',
            }
          : undefined,
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

export const EMAIL_FROM = getSenderEmail()
export const COMPANY_EMAIL = getSupportEmail()
