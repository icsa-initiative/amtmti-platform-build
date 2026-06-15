import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { newsletterNotificationTemplate, newsletterConfirmationTemplate } from './templates/newsletter'

export async function sendNewsletterEmails(email: string) {
  const subscriberData = { email }
  const adminHtml = newsletterNotificationTemplate(subscriberData)
  const subscriberHtml = newsletterConfirmationTemplate(subscriberData)

  const [adminSent, subscriberSent] = await Promise.all([
    sendNotificationEmail(
      'New Newsletter Subscriber',
      adminHtml,
      'AMTMTI',
    ),
    sendConfirmationEmail(
      email,
      'Welcome to the AMTMTI Newsletter',
      subscriberHtml,
      'AMTMTI Communications',
    ),
  ])

  return { adminSent, subscriberSent }
}
