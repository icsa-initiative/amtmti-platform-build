import type { EmailPayload } from './email-types'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM
const MAX_RETRIES = 2

export async function sendEmailResend(
  payload: EmailPayload,
  retries = MAX_RETRIES,
): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('Resend API key is not configured.')
    return false
  }

  if (!EMAIL_FROM) {
    console.error('EMAIL_FROM is not configured.')
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
        from: payload.fromName ? `${payload.fromName} <${EMAIL_FROM}>` : EMAIL_FROM,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('Resend error:', body)
      if (retries > 0) {
        return sendEmailResend(payload, retries - 1)
      }
      return false
    }

    return true
  } catch (error) {
    console.error('Resend request failed:', error)
    if (retries > 0) {
      return sendEmailResend(payload, retries - 1)
    }
    return false
  }
}
