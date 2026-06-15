const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export interface EnrollmentTemplateData {
  fullName: string
  email: string
  phone?: string
  program: string
  startDate?: string
  message?: string
}

export function enrollmentNotificationTemplate(
  data: EnrollmentTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Program Enrollment Request</h2>
      <p>A user submitted an enrollment request on your website.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
        <li><strong>Program:</strong> ${data.program}</li>
        ${data.startDate ? `<li><strong>Preferred start date:</strong> ${data.startDate}</li>` : ''}
        <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
        ${sourcePage ? `<li><strong>Source Page:</strong> <a href="${sourcePage}">${sourcePage}</a></li>` : ''}
      </ul>
      ${data.message ? `<h3>Message</h3><p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message}</p>` : ''}
      <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated notification from AMTMTI.</p>
    </div>
  `
}

export function enrollmentConfirmationTemplate(
  data: EnrollmentTemplateData,
  sourcePage?: string,
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Your AMTMTI Enrollment Request Is Received</h2>
      <p>Dear ${data.fullName},</p>
      <p>We have received your enrollment request for <strong>${data.program}</strong>. Our team will review your submission and contact you shortly.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
        ${data.startDate ? `<li><strong>Preferred start date:</strong> ${data.startDate}</li>` : ''}
      </ul>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      ${sourcePage ? `<p><strong>Submitted from:</strong> <a href="${sourcePage}">${sourcePage}</a></p>` : ''}
      <p>Kind regards,<br/><strong>AMTMTI Team</strong><br/><a href="${SITE_URL}" style="color: #0F4C81;">${SITE_URL}</a></p>
    </div>
  `
}
