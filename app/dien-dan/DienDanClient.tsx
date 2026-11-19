'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import ThreadCreateModal from '@/components/home/ThreadCreateModal';
import type { Comment, Thread } from '@/lib/supabase/types';

interface DienDanClientProps {
  initialThreads: Thread[];
}

export default function DienDanClient({ initialThreads }: DienDanClientProps) {
  const { showToast } = useToast();
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentAuthor, setCommentAuthor] = useState<Record<string, string>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qt_liked_threads');
      if (saved) setLikedIds(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const availableTags = useMemo(() => {
    const tags = new Set<string>(['Kinh nghiệm', 'Hỏi đáp', 'Review ẩm thực', 'Săn mây Sa Mù']);
    threads.forEach((t) => {
      if (t.tag) tags.add(t.tag);
    });
    return Array.from(tags);
  }, [threads]);

  const filteredThreads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return threads.filter((th) => {
      const matchTag = selectedTag === 'all' || th.tag === selectedTag;
      const matchZone = selectedZone === 'all' || th.zoneCode === selectedZone;
      const matchSearch =
        !q ||
        th.title.toLowerCase().includes(q) ||
        th.content.toLowerCase().includes(q) ||
        th.author.toLowerCase().includes(q);
      return matchTag && matchZone && matchSearch;
    });
  }, [threads, selectedTag, selectedZone, searchQuery]);

  const handleLike = async (threadId: string) => {
    if (likedIds[threadId]) {
      showToast('Bạn đã thích bài viết này rồi.', 'info');
      return;
    }

    const nextLiked = { ...likedIds, [threadId]: true };
    setLikedIds(nextLiked);
    try {
      localStorage.setItem('qt_liked_threads', JSON.stringify(nextLiked));
    } catch {
      // ignore
    }

    setThreads((prev) =>
      prev.map((th) =>
        th.id === threadId
          ? {
              ...th,
              likes: (th.likes_count ?? th.likes ?? 0) + 1,
              likes_count: (th.likes_count ?? th.likes ?? 0) + 1,
            }
          : th
      )
    );

    try {
      const res = await fetch('/api/threads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: threadId, action: 'like' }),
      });
      const data = await res.json();
      if (res.ok && typeof data?.likes_count === 'number') {
        setThreads((prev) =>
          prev.map((th) =>
            th.id === threadId
              ? { ...th, likes: data.likes_count, likes_count: data.likes_count }
              : th
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (e: React.FormEvent, threadId: string) => {
    e.preventDefault();
    const text = (commentText[threadId] || '').trim();
    const author = (commentAuthor[threadId] || 'Bạn đọc').trim();

    if (text.length < 2) {
      showToast('Vui lòng nhập nội dung bình luận.', 'error');
      return;
    }

    setSubmittingCommentId(threadId);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, author, text }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể gửi bình luận lúc này.', 'error');
        return;
      }

      const newComment: Comment = data.comment;
      setThreads((prev) =>
        prev.map((th) =>
          th.id === threadId
            ? { ...th, comments: [...(th.comments || []), newComment] }
            : th
        )
      );
      setCommentText((prev) => ({ ...prev, [threadId]: '' }));
      showToast('Đã đăng bình luận của bạn!');
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error');
    } finally {
      setSubmittingCommentId(null);
    }
  };

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <div
          style={{
            backgroundColor: '#133e2f',
            color: '#fff',
            padding: '4rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              CỘNG ĐỒNG NHỮNG NGƯỜI ĐI CHẬM
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Nhật Ký & Thảo Luận Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
              Nơi du khách chia sẻ góc nhìn chân thật về cung đường, săn mây Sa Mù, ẩm thực và kinh nghiệm thực địa.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              style={{
                background: '#fbbf24',
                color: '#092118',
                padding: '0.75rem 1.5rem',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              ✍️ Chia sẻ chuyến đi của bạn
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ maxWidth: '900px', margin: '2rem auto 0', padding: '0 1.25rem' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '1.15rem 1.25rem',
              border: '1px solid rgba(27,42,34,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, kinh nghiệm, tác giả..."
                aria-label="Tìm bài viết diễn đàn"
                style={{ flex: '1 1 240px', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                aria-label="Lọc theo phân vùng"
                style={{ padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="QT-01">QT-01 · Đông Hà</option>
                <option value="QT-02">QT-02 · Thành Cổ</option>
                <option value="QT-03">QT-03 · Vĩnh Linh & Vịnh Mốc</option>
                <option value="QT-04">QT-04 · Cửa Việt</option>
                <option value="QT-05">QT-05 · Sa Mù - Khe Sanh</option>
                <option value="QT-06">QT-06 · Đakrông</option>
                <option value="QT-07">QT-07 · Đảo Cồn Cỏ</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => setSelectedTag('all')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: selectedTag === 'all' ? '#133e2f' : '#f3f4f6',
                  color: selectedTag === 'all' ? '#fff' : '#4b5563',
                }}
              >
                Tất cả chủ đề ({threads.length})
              </button>
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: selectedTag === tag ? '#133e2f' : '#f3f4f6',
                    color: selectedTag === tag ? '#fff' : '#4b5563',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Thread List */}
        <div style={{ maxWidth: '900px', margin: '2rem auto 0', padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredThreads.length === 0 ? (
            <div style={{ background: '#fff', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#6b7280' }}>
              Chưa có bài viết phù hợp với bộ lọc. Hãy là người đầu tiên chia sẻ kinh nghiệm của bạn!
            </div>
          ) : (
            filteredThreads.map((th) => {
              const isCommentsOpen = Boolean(expandedComments[th.id]);
              const commentsList = th.comments || [];
              const likeCount = th.likes_count ?? th.likes ?? 0;

              return (
                <article
                  key={th.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '18px',
                    padding: '1.75rem',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <SafeImage
                        src={th.avatar}
                        alt={th.author}
                        width={42}
                        height={42}
                        sizes="42px"
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#133e2f' }}>{th.author}</strong>
                          {th.badge && (
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '10px', color: '#4b5563' }}>
                              {th.badge}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{th.time}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                        {th.tag}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                        {th.zoneCode}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#133e2f', margin: '0 0 0.8rem 0' }}>
                    {th.title}
                  </h3>
                  <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem', margin: '0 0 1.2rem 0', whiteSpace: 'pre-line' }}>
                    {th.content}
                  </p>

                  {th.images && th.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
                      {th.images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', height: '190px', borderRadius: '12px', overflow: 'hidden' }}>
                          <SafeImage src={img} alt="Ảnh chuyến đi" fill sizes="320px" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', fontSize: '0.85rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleLike(th.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '20px',
                        border: likedIds[th.id] ? '1px solid #fca5a5' : '1px solid #e5e7eb',
                        background: likedIds[th.id] ? '#fef2f2' : '#f9fafb',
                        color: likedIds[th.id] ? '#dc2626' : '#4b5563',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ❤️ Thích ({likeCount})
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [th.id]: !prev[th.id] }))
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        background: isCommentsOpen ? '#ecfdf5' : '#f9fafb',
                        color: isCommentsOpen ? '#047857' : '#4b5563',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      💬 Bình luận ({commentsList.length})
                    </button>
                  </div>

                  {isCommentsOpen && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e5e7eb' }}>
                      {commentsList.length === 0 ? (
                        <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: '0.9rem' }}>
                          Chưa có bình luận nào. Hãy để lại góp ý hoặc đặt câu hỏi cho tác giả!
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                          {commentsList.map((c) => (
                            <div key={c.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.88rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <strong style={{ color: '#133e2f' }}>{c.author_name}</strong>
                                <span style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                                  {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : ''}
                                </span>
                              </div>
                              <p style={{ margin: 0, color: '#374151', lineHeight: 1.5 }}>{c.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={(e) => handleAddComment(e, th.id)} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={commentAuthor[th.id] || ''}
                          onChange={(e) => setCommentAuthor((prev) => ({ ...prev, [th.id]: e.target.value }))}
                          placeholder="Tên của bạn"
                          style={{ width: '150px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={commentText[th.id] || ''}
                          onChange={(e) => setCommentText((prev) => ({ ...prev, [th.id]: e.target.value }))}
                          placeholder="Viết bình luận hoặc hỏi thăm tình hình cung đường..."
                          style={{ flex: '1 1 220px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                        />
                        <button
                          type="submit"
                          disabled={submittingCommentId === th.id}
                          style={{
                            background: '#133e2f',
                            color: '#fff',
                            padding: '0.55rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          {submittingCommentId === th.id ? 'Đang gửi...' : 'Gửi'}
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </main>

      <Footer />

      <ThreadCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newThread) => setThreads((prev) => [newThread, ...prev])}
      />
    </div>
  );
}
