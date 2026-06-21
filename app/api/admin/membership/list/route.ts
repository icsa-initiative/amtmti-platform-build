import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  // DEBUG – verify Supabase service role key & URL
  console.log('SERVICE ROLE PRESENT:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  // Ensure admin is authenticated
  const admin = await isAdminAuthenticated()
  if (!admin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Use the Supabase service role key to bypass RLS for admin queries
  const supabase = createAdminClient()
  // Debug – count rows (head request)
const countQuery = await supabase
  .from('membership_applications')
  .select('*', { count: 'exact', head: true })
console.log('SERVICE ROLE PRESENT (admin list):', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('TABLE membership_applications count:', countQuery.count)
console.log('TABLE membership_applications count error:', countQuery.error)

const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching membership applications:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('API /admin/membership/list returning', data)
  // Debug – log raw query result
console.log('RAW membership_applications DATA:', data)
console.log('RAW membership_applications ERROR:', error)
return NextResponse.json(data)
}
