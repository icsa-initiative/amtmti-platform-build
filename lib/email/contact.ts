import { getSupportEmail, sendEmail } from './service'
import type { ContactForm } from '@/lib/validations/contact'

export async function sendContactEmails(data: ContactForm) {
  const adminEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Website Contact Message</h2>
      <p>A new message has been received from your website contact form:</p>
      
      <h3>Sender Information</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
        <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
        <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <h3>Message</h3>
      <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message}</p>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated notification. Please respond to the sender at ${data.email}
      </p>
    </div>
  `

  const senderEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">We Have Received Your Message</h2>
      
      <p>Dear ${data.name},</p>

      <p>Thank you for contacting AMTMTI.</p>

      <p>Your message has been received successfully and a member of our team will respond as soon as possible.</p>

      <p>We appreciate your interest in our programs, research, and professional development opportunities.</p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Support Team</strong><br/>
      Africa Medication Therapy Management Training Institute<br/>
      <a href="https://amtmti.africa" style="color: #0F4C81;">www.amtmti.africa</a>
      </p>
    </div>
  `

  const [adminSent, senderSent] = await Promise.all([
    sendEmail({
      to: getSupportEmail(),
      subject: 'New Website Contact Message',
      html: adminEmail,
      fromName: 'AMTMTI',
      fromEmail: getSupportEmail(),
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: 'We Have Received Your Message',
      html: senderEmail,
      fromName: 'AMTMTI Support',
      fromEmail: getSupportEmail(),
      replyTo: getSupportEmail(),
    }),
  ])

  return { adminSent, senderSent }
}
