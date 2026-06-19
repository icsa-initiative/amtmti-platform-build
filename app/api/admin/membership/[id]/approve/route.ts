import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const supabase = await createClient()
  const { error } = await supabase
    .from('membership_applications')
    .update({ status: 'approved' })
    .eq('id', params.id)

  if (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Optional: assign membership type to user account (if exists)
  // Not implemented here – placeholder for future integration

  return NextResponse.json({ success: true })
}
