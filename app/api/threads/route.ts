import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data: threads, error } = await supabaseServer
      .from('threads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, threads });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, tag, zoneCode, title, content, images } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 });
    }

    const { data, error } = await supabaseServer.from('threads').insert({
      author_name: author || 'Khách lãng du',
      author_badge: 'Thành viên mới',
      tag: tag || 'Kinh nghiệm',
      zone_code: zoneCode || 'QT-05',
      title: title.trim(),
      content: content.trim(),
      images: images || [],
      likes_count: 1,
    }).select('*').single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, thread: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
