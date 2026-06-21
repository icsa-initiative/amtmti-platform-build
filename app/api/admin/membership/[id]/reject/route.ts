import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdminAuthenticated()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  const supabase = await createClient()
  const { error } = await supabase
    .from('membership_applications')
    .update({ status: 'rejected' })
    .eq('id', params.id)

  if (error) {
    console.error('Reject error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
