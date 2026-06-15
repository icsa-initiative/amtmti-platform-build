import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { membershipNotificationTemplate, membershipConfirmationTemplate } from './templates/membership'
import type { MembershipApplication } from '@/lib/validations/membership'

export async function sendMembershipEmails(data: MembershipApplication) {
  const adminHtml = membershipNotificationTemplate(data)
  const memberHtml = membershipConfirmationTemplate(data)

  const [adminSent, memberSent] = await Promise.all([
    sendNotificationEmail(
      'New Membership Application',
      adminHtml,
      'AMTMTI',
    ),
    sendConfirmationEmail(
      data.email,
      'Your AMTMTI Membership Application Has Been Received',
      memberHtml,
      'AMTMTI Membership',
    ),
  ])

  return { adminSent, memberSent }
}
