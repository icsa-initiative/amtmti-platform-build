import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminToken } from '@/lib/admin-token'

export async function GET(req: NextRequest) {
  try {
    // NOTE: Authentication disabled for development/debugging.
    // const token = req.cookies.get('amtmti_admin')?.value
    // if (!token || !(await verifyAdminToken(token))) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 },
    //   )
    // }

    const supabase = (await createClient({ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY })) as any

    // Fetch all enrollment applications
    console.log('Fetching enrollment applications')
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
