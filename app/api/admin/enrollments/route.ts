import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminToken } from '@/lib/admin-token'

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = req.cookies.get('amtmti_admin')?.value
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const supabase = (await createClient()) as any

    // Fetch all enrollment applications
    const { data, error } = await supabase
      .from('enrollment_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 },
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
