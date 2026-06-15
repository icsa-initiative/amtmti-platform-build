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

    // Fetch program details to get accurate fee
    let programFee = body.programFee || 0
    let programCategory = body.programCategory || ''
    let programDuration = body.programDuration || ''
    let programStudyMode = body.programStudyMode || ''

    if (validatedData.courseId) {
      // First try lookup by id
      let programRes = await supabase
        .from('programs')
        .select('fees_ksh, category, duration, mode')
        .eq('id', validatedData.courseId)
        .maybeSingle()

      // If not found, try slug lookup
      if (!programRes.data) {
        programRes = await supabase
          .from('programs')
          .select('fees_ksh, category, duration, mode')
          .eq('slug', validatedData.courseId)
          .maybeSingle()
      }

      const program = programRes.data
      if (program) {
        programFee = program.fees_ksh || 0
        programCategory = program.category || ''
        programDuration = program.duration || ''
        programStudyMode = program.mode || ''
      }
    }

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
          program_category: programCategory,
          program_duration: programDuration,
          program_study_mode: programStudyMode,
          program_fee: programFee,
          highest_education: validatedData.highestEducation,
          current_profession: validatedData.currentProfession,
          employer: validatedData.employer,
          years_of_experience: validatedData.yearsOfExperience,
          interest_reason: validatedData.interestReason,
          preferred_learning_mode: validatedData.preferredLearningMode,
          application_status: 'Pending Review',
          payment_status: 'Pending',
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

    // Prepare data for email
    const emailData = {
      ...validatedData,
      programCategory,
      programDuration,
      programStudyMode,
      programFee,
    }

    // Send emails
    try {
      await sendEnrollmentEmails(emailData)

      // Update email_status in database
      await supabase
        .from('enrollment_applications')
        .update({ email_status: 'sent' })
        .eq('id', data.id)
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Update email_status as failed
      await supabase
        .from('enrollment_applications')
        .update({ email_status: 'failed' })
        .eq('id', data.id)
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
