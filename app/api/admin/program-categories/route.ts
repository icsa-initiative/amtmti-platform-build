import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-token';

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))?.split('=')[1];
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = await createClient({ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY });
  const { data, error } = await supabase.from('program_categories').select('*').order('title');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`))?.split('=')[1];
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { slug, title, description } = body;
  const supabase = await createClient({ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY });
  const { data, error } = await supabase.from('program_categories').insert({ slug, title, description }).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
