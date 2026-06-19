import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  // Ensure admin is authenticated
  const admin = await isAdminAuthenticated()
  if (!admin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Use the Supabase service role key to bypass RLS for admin queries
  const supabase = await createClient({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching membership applications:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('API /admin/membership/list returning', data)
  return NextResponse.json(data)
}
