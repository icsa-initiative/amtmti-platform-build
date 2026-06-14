import { sendEmail, COMPANY_EMAIL } from './service'

export async function sendNewsletterEmails(email: string) {
  const adminEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Newsletter Subscriber</h2>
      
      <ul style="list-style: none; padding: 0;">
        <li><strong>Subscriber Email:</strong> ${email}</li>
        <li><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This subscriber has been added to your mailing list.
      </p>
    </div>
  `

  const subscriberEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Welcome to the AMTMTI Newsletter</h2>
      
      <p>Thank you for subscribing to the AMTMTI newsletter.</p>

      <p>You will now receive updates about:</p>
      <ul style="list-style: none; padding-left: 20px;">
        <li>✓ New programs</li>
        <li>✓ Research publications</li>
        <li>✓ Events and webinars</li>
        <li>✓ Membership opportunities</li>
        <li>✓ Institute announcements</li>
      </ul>

      <p>We are excited to keep you informed.</p>

      <p>Kind regards,<br/>
      <strong>AMTMTI Communications Team</strong><br/>
      Africa Medication Therapy Management Training Institute<br/>
      <a href="https://amtmti.africa" style="color: #0F4C81;">www.amtmti.africa</a>
      </p>
    </div>
  `

  const [adminSent, subscriberSent] = await Promise.all([
    sendEmail({
      to: COMPANY_EMAIL,
      subject: 'New Newsletter Subscriber',
      html: adminEmail,
      fromName: 'AMTMTI',
    }),
    sendEmail({
      to: email,
      subject: 'Welcome to the AMTMTI Newsletter',
      html: subscriberEmail,
      fromName: 'AMTMTI Communications',
    }),
  ])

  return { adminSent, subscriberSent }
}
