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
    const parentId = body.parentId || body.parent_id ? String(body.parentId || body.parent_id).trim() : null;
    const authorName = String(body.author || body.author_name || 'Bạn đọc').trim().slice(0, 80);
    const text = String(body.text || '').trim();
    const rawImages = Array.isArray(body.images) ? body.images : [];

    if (!threadId) {
      return NextResponse.json({ success: false, error: 'Thiếu ID bài viết.' }, { status: 400 });
    }
    if (rawImages.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Chỉ được tải lên tối đa 5 ảnh cho mỗi bình luận.' },
        { status: 400 }
      );
    }

    const images = rawImages
      .filter((img: unknown): img is string => typeof img === 'string')
      .map((img: string) => img.trim())
      .filter(
        (img: string) =>
          img.startsWith('data:image/') ||
          img.startsWith('https://') ||
          img.startsWith('http://') ||
          img.startsWith('/')
      )
      .slice(0, 5);

    if (text.length === 0 && images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập nội dung hoặc đính kèm ít nhất 1 ảnh.' },
        { status: 400 }
      );
    }
    if (text.length > 1500) {
      return NextResponse.json(
        { success: false, error: 'Bình luận tối đa 1500 ký tự.' },
        { status: 400 }
      );
    }

    const insertPayload: Record<string, any> = {
      thread_id: threadId,
      author_name: authorName || 'Bạn đọc',
      author_avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text,
    };
    if (parentId) insertPayload.parent_id = parentId;
    if (images.length > 0) insertPayload.images = images;

    const { data, error } = await supabaseServer
      .from('comments')
      .insert(insertPayload)
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
