'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import SubpageHero from '@/components/common/SubpageHero';
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
  const [commentImages, setCommentImages] = useState<Record<string, string[]>>({});
  const [replyTarget, setReplyTarget] = useState<Record<string, { id: string; author: string } | null>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('File không phải ảnh hợp lệ.'));
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(String(reader.result));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSelectImages = async (formKey: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const current = commentImages[formKey] || [];
    const remaining = 5 - current.length;
    if (remaining <= 0) {
      showToast('Mỗi bình luận chỉ được tải lên tối đa 5 ảnh.', 'error');
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      showToast(`Chỉ thêm được ${remaining} ảnh nữa (tối đa 5 ảnh/bình luận).`, 'info');
    }

    try {
      const compressed = await Promise.all(
        picked
          .filter((f) => f.type.startsWith('image/'))
          .map((f) => compressImageFile(f))
      );
      if (compressed.length > 0) {
        setCommentImages((prev) => ({
          ...prev,
          [formKey]: [...(prev[formKey] || []), ...compressed].slice(0, 5),
        }));
      }
    } catch {
      showToast('Không thể xử lý một số ảnh đã chọn.', 'error');
    }
  };

  const handleRemoveImage = (formKey: string, index: number) => {
    setCommentImages((prev) => ({
      ...prev,
      [formKey]: (prev[formKey] || []).filter((_, idx) => idx !== index),
    }));
  };

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

  const handleAddComment = async (
    e: React.FormEvent,
    threadId: string,
    parentId?: string | null
  ) => {
    e.preventDefault();
    const formKey = parentId ? `${threadId}::${parentId}` : threadId;
    const text = (commentText[formKey] || '').trim();
    const author = (commentAuthor[formKey] || commentAuthor[threadId] || 'Bạn đọc').trim();
    const images = commentImages[formKey] || [];

    if (text.length === 0 && images.length === 0) {
      showToast('Vui lòng nhập nội dung hoặc đính kèm ít nhất 1 ảnh.', 'error');
      return;
    }

    setSubmittingCommentId(formKey);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          parentId: parentId || null,
          author,
          text,
          images,
        }),
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
      setCommentText((prev) => ({ ...prev, [formKey]: '' }));
      setCommentImages((prev) => ({ ...prev, [formKey]: [] }));
      if (parentId) {
        setReplyTarget((prev) => ({ ...prev, [threadId]: null }));
      }
      showToast(parentId ? 'Đã gửi phản hồi!' : 'Đã đăng bình luận của bạn!');
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
        <SubpageHero
          kicker="CỘNG ĐỒNG NHỮNG NGƯỜI ĐI CHẬM"
          kickerIcon="bi-chat-dots"
          title="Nhật Ký & Thảo Luận Quảng Trị"
          subtitle="Nơi du khách chia sẻ góc nhìn chân thật về cung đường, săn mây Sa Mù, ẩm thực và kinh nghiệm thực địa."
          highlights={[
            { icon: 'bi-journal-richtext', label: `${threads.length} bài chia sẻ thực tế` },
            { icon: 'bi-chat-left-text', label: 'Hỏi đáp & bình luận nhanh' },
            { icon: 'bi-cloud-sun', label: 'Cập nhật thời tiết đường đèo' },
          ]}
          slides={[
            {
              image: '/images/deo-sa-mu-clouds.jpg',
              tag: 'REVIEW SĂN MÂY',
              title: 'Kinh Nghiệm Săn Mây Đèo Sa Mù 5h30 Sáng',
              caption: 'Chia sẻ thực tế về nhiệt độ, trang phục giữ ấm và góc chụp đẹp nhất trên đèo.',
            },
            {
              image: '/images/hien-luong-bridge.jpg',
              tag: 'HÀNH TRÌNH DI SẢN',
              title: 'Cảm Xúc Khi Ghé Thành Cổ & Vĩ Tuyến 17',
              caption: 'Những dòng nhật ký lắng đọng từ các bạn trẻ lần đầu đặt chân đến vùng đất thiêng.',
            },
            {
              image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80',
              tag: 'REVIEW QUÁN NGON',
              title: 'Bản Đồ Quán Ăn Ngon Giá Bình Dân',
              caption: 'Tổng hợp đánh giá chân thực từ cộng đồng phượt thủ vừa trở về từ Quảng Trị.',
            },
          ]}
        >
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
            <i className="bi bi-pencil-square" aria-hidden="true" /> Chia sẻ chuyến đi của bạn
          </button>
        </SubpageHero>

        {/* Filter & Search Bar */}
        <ScrollReveal variant="fade-in">
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
        </ScrollReveal>

        {/* Thread List */}
        <div style={{ maxWidth: '900px', margin: '2rem auto 0', padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredThreads.length === 0 ? (
            <div style={{ background: '#fff', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#6b7280' }}>
              Chưa có bài viết phù hợp với bộ lọc. Hãy là người đầu tiên chia sẻ kinh nghiệm của bạn!
            </div>
          ) : (
            filteredThreads.map((th, idx) => {
              const isCommentsOpen = Boolean(expandedComments[th.id]);
              const commentsList = th.comments || [];
              const likeCount = th.likes_count ?? th.likes ?? 0;

              return (
                <ScrollReveal key={th.id} delayMs={(idx % 3) * 70}>
                <article
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
                      <i className="bi bi-heart-fill" aria-hidden="true" /> Thích ({likeCount})
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
                      <i className="bi bi-chat-dots" aria-hidden="true" /> Bình luận ({commentsList.length})
                    </button>
                  </div>

                  {isCommentsOpen && (() => {
                    const commentById = new Map(commentsList.map((c) => [c.id, c]));
                    const getRootId = (c: Comment): string => {
                      let curr: Comment | undefined = c;
                      const seen = new Set<string>();
                      while (curr?.parent_id && commentById.has(curr.parent_id) && !seen.has(curr.id)) {
                        seen.add(curr.id);
                        curr = commentById.get(curr.parent_id);
                      }
                      return curr?.id || c.id;
                    };

                    const rootComments = commentsList.filter((c) => !c.parent_id || !commentById.has(c.parent_id));
                    const repliesByRoot = new Map<string, Comment[]>();
                    for (const c of commentsList) {
                      if (c.parent_id && commentById.has(c.parent_id)) {
                        const rootId = getRootId(c);
                        const arr = repliesByRoot.get(rootId) || [];
                        arr.push(c);
                        repliesByRoot.set(rootId, arr);
                      }
                    }

                    const activeReply = replyTarget[th.id] || null;
                    const renderCommentCard = (c: Comment, isReply: boolean) => {
                      const parentAuthor = c.parent_id ? commentById.get(c.parent_id)?.author_name : null;
                      const imgs = Array.isArray(c.images) ? c.images : [];
                      return (
                        <div
                          key={c.id}
                          style={{
                            background: isReply ? '#ffffff' : '#f8fafc',
                            border: isReply ? '1px solid #e2e8f0' : '1px solid rgba(19,62,47,0.06)',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            fontSize: '0.88rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              <strong style={{ color: '#133e2f' }}>{c.author_name}</strong>
                              {isReply && parentAuthor && (
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  <i className="bi bi-reply-fill" aria-hidden="true" /> trả lời <strong>{parentAuthor}</strong>
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                              {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : ''}
                            </span>
                          </div>

                          {c.text && (
                            <p style={{ margin: 0, color: '#374151', lineHeight: 1.55 }}>{c.text}</p>
                          )}

                          {imgs.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: c.text ? '0.6rem' : '0.2rem' }}>
                              {imgs.map((imgUrl, imgIdx) => (
                                <button
                                  key={`${c.id}-img-${imgIdx}`}
                                  type="button"
                                  onClick={() => setLightboxImage(imgUrl)}
                                  aria-label={`Xem ảnh ${imgIdx + 1} của ${c.author_name}`}
                                  style={{
                                    padding: 0,
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    width: '86px',
                                    height: '86px',
                                    cursor: 'zoom-in',
                                    background: '#f1f5f9',
                                  }}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Ảnh bình luận ${imgIdx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  />
                                </button>
                              ))}
                            </div>
                          )}

                          <div style={{ marginTop: '0.45rem' }}>
                            <button
                              type="button"
                              onClick={() =>
                                setReplyTarget((prev) => ({
                                  ...prev,
                                  [th.id]: { id: c.id, author: c.author_name },
                                }))
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#047857',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <i className="bi bi-reply" aria-hidden="true" /> Trả lời
                            </button>
                          </div>
                        </div>
                      );
                    };

                    const renderCommentForm = (formKey: string, parentId?: string | null) => {
                      const selectedImgs = commentImages[formKey] || [];
                      const isSending = submittingCommentId === formKey;
                      return (
                        <form
                          onSubmit={(e) => handleAddComment(e, th.id, parentId)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.55rem',
                            background: parentId ? '#f0fdf4' : 'transparent',
                            padding: parentId ? '0.85rem' : 0,
                            borderRadius: parentId ? '12px' : 0,
                            border: parentId ? '1px solid #bbf7d0' : 'none',
                          }}
                        >
                          {parentId && activeReply && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#166534' }}>
                              <span>
                                <i className="bi bi-reply-fill" aria-hidden="true" /> Đang trả lời <strong>{activeReply.author}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => setReplyTarget((prev) => ({ ...prev, [th.id]: null }))}
                                style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 700, cursor: 'pointer', fontSize: '0.76rem' }}
                              >
                                <i className="bi bi-x-lg" aria-hidden="true" /> Hủy
                              </button>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                              type="text"
                              value={commentAuthor[formKey] ?? commentAuthor[th.id] ?? ''}
                              onChange={(e) => setCommentAuthor((prev) => ({ ...prev, [formKey]: e.target.value }))}
                              placeholder="Tên của bạn"
                              style={{ width: '145px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', background: '#fff' }}
                            />
                            <input
                              type="text"
                              value={commentText[formKey] || ''}
                              onChange={(e) => setCommentText((prev) => ({ ...prev, [formKey]: e.target.value }))}
                              placeholder={parentId ? 'Viết câu trả lời...' : 'Viết bình luận hoặc hỏi thăm tình hình cung đường...'}
                              style={{ flex: '1 1 220px', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', background: '#fff' }}
                            />
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.55rem 0.85rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: selectedImgs.length >= 5 ? '#f3f4f6' : '#fff',
                                color: selectedImgs.length >= 5 ? '#9ca3af' : '#133e2f',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: selectedImgs.length >= 5 ? 'not-allowed' : 'pointer',
                              }}
                              title="Tải lên tối đa 5 ảnh"
                            >
                              <i className="bi bi-images" aria-hidden="true" />
                              <span>Ảnh ({selectedImgs.length}/5)</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={selectedImgs.length >= 5}
                                onChange={(e) => {
                                  handleSelectImages(formKey, e.target.files);
                                  e.target.value = '';
                                }}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <button
                              type="submit"
                              disabled={isSending}
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
                              {isSending ? 'Đang gửi...' : parentId ? 'Trả lời' : 'Gửi'}
                            </button>
                          </div>

                          {selectedImgs.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                              {selectedImgs.map((src, idx) => (
                                <div key={`${formKey}-preview-${idx}`} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d1d5db' }}>
                                  <img src={src} alt={`Xem trước ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(formKey, idx)}
                                    aria-label="Xóa ảnh"
                                    style={{
                                      position: 'absolute',
                                      top: '2px',
                                      right: '2px',
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      border: 'none',
                                      background: 'rgba(0,0,0,0.7)',
                                      color: '#fff',
                                      fontSize: '0.7rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <i className="bi bi-x" aria-hidden="true" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </form>
                      );
                    };

                    return (
                      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e5e7eb' }}>
                        {commentsList.length === 0 ? (
                          <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: '0.9rem' }}>
                            Chưa có bình luận nào. Hãy để lại góp ý hoặc đặt câu hỏi cho tác giả!
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.1rem' }}>
                            {rootComments.map((root) => {
                              const replies = repliesByRoot.get(root.id) || [];
                              const isReplyingHere =
                                activeReply && (activeReply.id === root.id || replies.some((r) => r.id === activeReply.id));
                              return (
                                <div key={root.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {renderCommentCard(root, false)}

                                  {(replies.length > 0 || isReplyingHere) && (
                                    <div
                                      style={{
                                        marginLeft: '1rem',
                                        paddingLeft: '0.9rem',
                                        borderLeft: '2px solid #cbd5e1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                      }}
                                    >
                                      {replies.map((rep) => renderCommentCard(rep, true))}
                                      {isReplyingHere && activeReply && renderCommentForm(`${th.id}::${activeReply.id}`, activeReply.id)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {renderCommentForm(th.id, null)}
                      </div>
                    );
                  })()}
                </article>
                </ScrollReveal>
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

      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh bình luận"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 33, 24, 0.85)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Đóng ảnh"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
          <img
            src={lightboxImage}
            alt="Ảnh phóng to"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
          />
        </div>
      )}
    </div>
  );
}
