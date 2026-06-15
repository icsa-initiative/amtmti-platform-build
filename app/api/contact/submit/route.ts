import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactEmails } from '@/lib/email/contact'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = contactFormSchema.parse(body)

    // Create Supabase client
    const supabase = await createClient()

    // Insert into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          inquiry_type: validatedData.inquiryType,
          message: validatedData.message,
          phone: validatedData.phone || null,
          source: 'web_form',
          email_status: 'pending',
          status: 'new',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save contact message' },
        { status: 500 },
      )
    }

    // Send emails
    const emailResult = await sendContactEmails(validatedData)
    const emailStatus = emailResult.adminSent && emailResult.senderSent ? 'sent' : 'failed'

    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ email_status: emailStatus })
      .eq('id', data.id)

    if (updateError) {
      console.error('Failed to update contact email status:', updateError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        messageId: data.id,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
