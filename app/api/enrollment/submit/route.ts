import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fullEnrollmentSchema } from '@/lib/validations/enrollment'
import { sendEnrollmentEmails } from '@/lib/email/enrollment'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate data
    const validatedData = fullEnrollmentSchema.parse(body)

    // Create Supabase client
    const supabase = await createClient()

    // Insert into database
    const { data, error } = await supabase
      .from('enrollment_applications')
      .insert([
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          country: validatedData.country,
          region: validatedData.region,
          date_of_birth: validatedData.dateOfBirth,
          gender: validatedData.gender || null,
          intake: validatedData.intake,
          course_type: validatedData.courseType,
          course_id: validatedData.courseId,
          course_name: validatedData.courseName,
          application_status: 'Pending',
          source: 'web_form',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 },
      )
    }

    // Send emails
    try {
      await sendEnrollmentEmails(validatedData)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
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
