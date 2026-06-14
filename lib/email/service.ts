const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@amtmti.africa'
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'admissions@amtmti.africa'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

export interface EmailOptions {
  to: string
  subject: string
  html: string
  fromName?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (EMAIL_PROVIDER === 'resend') {
    return sendEmailResend(options)
  } else if (EMAIL_PROVIDER === 'sendgrid') {
    return sendEmailSendGrid(options)
  } else {
    console.warn(`Unknown email provider: ${EMAIL_PROVIDER}`)
    return false
  }
}

async function sendEmailResend(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('Resend API key not configured')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.fromName ? `${options.fromName} <${EMAIL_FROM}>` : EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email with Resend:', error)
    return false
  }
}

async function sendEmailSendGrid(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured')
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
      const error = await response.json()
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
