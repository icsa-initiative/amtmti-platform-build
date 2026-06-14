import { sendEmail, COMPANY_EMAIL } from './service'
import type { MembershipApplication } from '@/lib/validations/membership'

export async function sendMembershipEmails(data: MembershipApplication) {
  const adminEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Membership Application</h2>
      <p>A new membership application has been received:</p>
      
      <h3>Applicant Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Full Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Country:</strong> ${data.country}</li>
        <li><strong>Profession:</strong> ${data.profession}</li>
        <li><strong>Membership Tier:</strong> ${data.membershipTier}</li>
        <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <h3>Reason for Joining</h3>
      <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${data.reasonForJoining}</p>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification. Please review the application in your admin dashboard.
      </p>
    </div>
  `

  const memberEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Your AMTMTI Membership Application Has Been Received</h2>
      
      <p>Dear ${data.fullName},</p>

      <p>Thank you for applying for membership with the Africa Medication Therapy Management Training Institute (AMTMTI).</p>

      <p>We have successfully received your application and our team will review it shortly.</p>

      <p>We appreciate your interest in joining Africa's growing community of medication therapy management professionals.</p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Membership Team</strong><br/>
      Africa Medication Therapy Management Training Institute<br/>
      <a href="https://amtmti.africa" style="color: #0F4C81;">www.amtmti.africa</a>
      </p>
    </div>
  `

  const [adminSent, memberSent] = await Promise.all([
    sendEmail({
      to: COMPANY_EMAIL,
      subject: 'New Membership Application',
      html: adminEmail,
      fromName: 'AMTMTI',
    }),
    sendEmail({
      to: data.email,
      subject: 'Your AMTMTI Membership Application Has Been Received',
      html: memberEmail,
      fromName: 'AMTMTI Membership',
    }),
  ])

  return { adminSent, memberSent }
}
