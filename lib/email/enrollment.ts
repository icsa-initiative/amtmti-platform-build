import { sendNotificationEmail } from './send-notification'
import { sendConfirmationEmail } from './send-confirmation'
import { enrollmentNotificationTemplate, enrollmentConfirmationTemplate } from './templates/enrollment'
import type { FullEnrollment } from '@/lib/validations/enrollment'

export async function sendEnrollmentEmails(data: FullEnrollment) {
  const enrollmentData = {
    fullName: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    program: `${data.courseName} (${data.courseType})`,
    startDate: data.intake,
    message: `Country: ${data.country}\nRegion: ${data.region}\nDate of Birth: ${data.dateOfBirth}\nGender: ${data.gender ?? 'Not specified'}`,
  }

  const adminHtml = enrollmentNotificationTemplate(enrollmentData)
  const applicantHtml = enrollmentConfirmationTemplate(enrollmentData)

  const [adminSent, applicantSent] = await Promise.all([
    sendNotificationEmail(
      'New AMTMTI Enrollment Application',
      adminHtml,
      'AMTMTI',
    ),
    sendConfirmationEmail(
      data.email,
      'Your AMTMTI Application Has Been Received',
      applicantHtml,
      'AMTMTI Admissions',
    ),
  ])

  return { adminSent, applicantSent }
}
