import { sendEmail } from './service'

export async function sendConfirmationEmail(
  to: string,
  subject: string,
  html: string,
  fromName = 'AMTMTI',
) {
  return sendEmail({
    to,
    subject,
    html,
    fromName,
  })
}
