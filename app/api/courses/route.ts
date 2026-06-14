import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const courseType = searchParams.get('courseType')

    const supabase = await createClient()

    let query = supabase
      .from('courses')
      .select('id, name, course_type, description')

    if (courseType) {
      query = query.eq('course_type', courseType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
