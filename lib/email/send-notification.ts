import { COMPANY_EMAIL, sendEmail } from './service'

export async function sendNotificationEmail(
  subject: string,
  html: string,
  fromName = 'AMTMTI',
) {
  return sendEmail({
    to: COMPANY_EMAIL,
    subject,
    html,
    fromName,
  })
}
