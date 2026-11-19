import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { formatSupabaseWriteError } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get('threadId');
  try {
    let query = supabaseServer
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });
    if (threadId) {
      query = query.eq('thread_id', threadId);
    }
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, comments: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const threadId = String(body.threadId || body.thread_id || '').trim();
    const authorName = String(body.author || body.author_name || 'Bạn đọc').trim().slice(0, 80);
    const text = String(body.text || '').trim();

    if (!threadId) {
      return NextResponse.json({ success: false, error: 'Thiếu ID bài viết.' }, { status: 400 });
    }
    if (text.length < 2 || text.length > 1500) {
      return NextResponse.json(
        { success: false, error: 'Bình luận phải từ 2 đến 1500 ký tự.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('comments')
      .insert({
        thread_id: threadId,
        author_name: authorName || 'Bạn đọc',
        author_avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/dien-dan');
    return NextResponse.json({ success: true, comment: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
