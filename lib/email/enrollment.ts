import { FullEnrollment } from '@/lib/validations/enrollment'

const AMTMTI_EMAIL = process.env.NEXT_PUBLIC_AMTMTI_EMAIL || 'admissions@amtmti.africa'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.')
    return
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
            to: [{ email: to }],
            subject,
          },
        ],
        from: { email: AMTMTI_EMAIL, name: 'AMTMTI Admissions' },
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(JSON.stringify(error))
    }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendEnrollmentEmails(data: FullEnrollment) {
  // Send to admissions team
  const adminEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New AMTMTI Enrollment Application</h2>
      <p>A new application has been received:</p>
      
      <h3>Applicant Details</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
        <li><strong>Country:</strong> ${data.country}</li>
        <li><strong>Region:</strong> ${data.region}</li>
        <li><strong>Date of Birth:</strong> ${data.dateOfBirth}</li>
        <li><strong>Gender:</strong> ${data.gender || 'Not specified'}</li>
      </ul>

      <h3>Application Details</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Intake:</strong> ${data.intake}</li>
        <li><strong>Course Type:</strong> ${data.courseType}</li>
        <li><strong>Selected Course:</strong> ${data.courseName}</li>
        <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification. Please review the application in your admin dashboard.
      </p>
    </div>
  `

  // Send to applicant
  const applicantEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Your AMTMTI Application Has Been Received</h2>
      
      <p>Dear ${data.firstName},</p>

      <p>Thank you for applying to Africa Medication Therapy Management Training Institute (AMTMTI).</p>

      <p>We have successfully received your application and our admissions team will review your submission and contact you shortly.</p>

      <h3 style="color: #0F4C81;">Application Details</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 5px 0;"><strong>Intake:</strong> ${data.intake}</li>
          <li style="padding: 5px 0;"><strong>Course Type:</strong> ${data.courseType}</li>
          <li style="padding: 5px 0;"><strong>Selected Course:</strong> ${data.courseName}</li>
        </ul>
      </div>

      <p style="margin-top: 20px;">We appreciate your interest in advancing your healthcare education with AMTMTI.</p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Admissions Team</strong><br/>
      Africa Medication Therapy Management Training Institute<br/>
      <a href="https://amtmti.africa" style="color: #0F4C81;">www.amtmti.africa</a>
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        If you have any questions, please reply to this email or contact us at ${AMTMTI_EMAIL}
      </p>
    </div>
  `

  await Promise.all([
    sendEmail(AMTMTI_EMAIL, 'New AMTMTI Enrollment Application', adminEmail),
    sendEmail(data.email, 'Your AMTMTI Application Has Been Received', applicantEmail),
  ])
}
