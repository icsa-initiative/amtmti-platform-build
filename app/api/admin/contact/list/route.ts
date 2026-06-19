import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  // Verify admin auth
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  // Use service role key to bypass RLS for admin
  // Use the service‑role key if it exists; otherwise fall back to the regular client.
  const supabase = await createClient({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  })

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  console.log('API /admin/contact/list returning', data)
  return NextResponse.json(data)
}
