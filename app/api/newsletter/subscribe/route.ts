import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { newsletterSubscribeSchema } from '@/lib/validations/newsletter'
import { sendNewsletterEmails } from '@/lib/email/newsletter'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = newsletterSubscribeSchema.parse(body)

    // Create Supabase client
    const supabase = await createClient()

    // Check for existing subscriber
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 },
      )
    }

    // Insert into database
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: validatedData.email,
          status: 'Active',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 },
      )
    }

    // Send emails
    try {
      await sendNewsletterEmails(validatedData.email)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        subscriberId: data.id,
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
