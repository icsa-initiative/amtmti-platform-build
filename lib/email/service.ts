import { sendEmailResend } from './resend'

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend'
const EMAIL_FROM = process.env.EMAIL_FROM
const COMPANY_EMAIL = process.env.COMPANY_EMAIL
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (!EMAIL_FROM) {
  console.warn('EMAIL_FROM is not configured. Please set EMAIL_FROM in environment variables.')
}

if (!COMPANY_EMAIL) {
  console.warn('COMPANY_EMAIL is not configured. Please set COMPANY_EMAIL in environment variables.')
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  fromName?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (EMAIL_PROVIDER === 'resend') {
    return sendEmailResend(options)
  }

  if (EMAIL_PROVIDER === 'sendgrid') {
    return sendEmailSendGrid(options)
  }

  console.warn(`Unknown email provider: ${EMAIL_PROVIDER}`)
  return false
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
