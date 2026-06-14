import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { membershipApplicationSchema } from '@/lib/validations/membership'
import { sendMembershipEmails } from '@/lib/email/membership'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = membershipApplicationSchema.parse(body)

    // Create Supabase client
    const supabase = await createClient()

    // Check for duplicate submissions from same email within 24 hours
    const { data: recentSubmission, error: checkError } = await supabase
      .from('membership_applications')
      .select('id, created_at')
      .eq('email', validatedData.email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single()

    if (recentSubmission && !checkError) {
      return NextResponse.json(
        { error: 'You have already submitted a membership application within the last 24 hours' },
        { status: 429 },
      )
    }

    // Insert into database
    const { data, error } = await supabase
      .from('membership_applications')
      .insert([
        {
          full_name: validatedData.fullName,
          email: validatedData.email,
          country: validatedData.country,
          profession: validatedData.profession,
          membership_tier: validatedData.membershipTier,
          reason_for_joining: validatedData.reasonForJoining,
          status: 'Pending',
          source: 'web_form',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save membership application' },
        { status: 500 },
      )
    }

    // Send emails
    try {
      await sendMembershipEmails(validatedData)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Membership application submitted successfully',
        applicationId: data.id,
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
