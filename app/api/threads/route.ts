import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getThreads } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeThread, parseStringArray } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function filterValidUrls(urls: string[]): string[] {
  return urls.filter((u) => {
    try {
      const parsed = new URL(u);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  });
}

export async function GET() {
  const threads = await getThreads();
  return NextResponse.json({ success: true, threads });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authorName = String(body.author || body.author_name || 'Khách lãng du').trim().slice(0, 80);
    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    const tag = String(body.tag || 'Kinh nghiệm').trim().slice(0, 60);
    const zoneCode = String(body.zoneCode || body.zone_code || 'QT-05').trim().slice(0, 16);
    const badge = String(body.badge || body.author_badge || 'Thành viên mới').trim().slice(0, 60);

    if (title.length < 3 || title.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề bài viết phải từ 3 đến 200 ký tự.' },
        { status: 400 }
      );
    }

    if (content.length < 10 || content.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Nội dung bài viết phải từ 10 đến 4000 ký tự.' },
        { status: 400 }
      );
    }

    const validImages = filterValidUrls(parseStringArray(body.images)).slice(0, 6);

    const { data, error } = await supabaseServer
      .from('threads')
      .insert({
        author_name: authorName || 'Khách lãng du',
        author_avatar:
          body.avatar ||
          body.author_avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        author_badge: badge,
        tag,
        zone_code: zoneCode,
        title,
        content,
        images: validImages,
        likes_count: 1,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/dien-dan');

    return NextResponse.json({
      success: true,
      thread: normalizeThread(data, []),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID bài viết.' }, { status: 400 });
    }

    if (body.action === 'like') {
      const { data: existing, error: fetchErr } = await supabaseServer
        .from('threads')
        .select('id, likes_count')
        .eq('id', id)
        .single();

      if (fetchErr || !existing) {
        return NextResponse.json(
          { success: false, error: 'Không tìm thấy bài viết.' },
          { status: 404 }
        );
      }

      const nextLikes = (Number(existing.likes_count) || 0) + 1;
      const { error: updateErr } = await supabaseServer
        .from('threads')
        .update({ likes_count: nextLikes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateErr) {
        return NextResponse.json(
          { success: false, error: formatSupabaseWriteError(updateErr) },
          { status: 400 }
        );
      }

      revalidatePath('/');
      revalidatePath('/dien-dan');
      return NextResponse.json({ success: true, id, likes_count: nextLikes });
    }

    // Full edit requires Admin session
    const unauthorized = requireAdmin(req);
    if (unauthorized) return unauthorized;

    const title = String(body.title || '').trim();
    const content = String(body.content || '').trim();
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và nội dung là bắt buộc.' },
        { status: 400 }
      );
    }

    const updatePayload = {
      author_name: String(body.author || body.author_name || 'Ban Quản Trị').trim(),
      author_badge: String(body.badge || body.author_badge || 'Biên tập viên').trim(),
      tag: String(body.tag || 'Kinh nghiệm').trim(),
      zone_code: String(body.zoneCode || body.zone_code || 'QT-01').trim(),
      title,
      content,
      images: filterValidUrls(parseStringArray(body.images)).slice(0, 6),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('threads')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/dien-dan');
    return NextResponse.json({ success: true, thread: normalizeThread(data, []) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Thiếu tham số id.' }, { status: 400 });
  }

  try {
    const { error } = await supabaseServer.from('threads').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/dien-dan');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
