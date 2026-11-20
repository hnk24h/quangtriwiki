'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppUser, UserRole, UserStatus } from '@/lib/supabase/types';

interface AdminUsersTabProps {
  currentAdminEmail: string;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

interface UserStats {
  total: number;
  cmsUsers: number;
  webUsers: number;
  active: number;
}

const ROLE_META: Record<UserRole, { label: string; bg: string; color: string; desc: string }> = {
  admin: {
    label: 'Quản trị viên (Admin)',
    bg: '#ecfdf5',
    color: '#047857',
    desc: 'Toàn quyền CMS & quản lý tài khoản',
  },
  editor: {
    label: 'Quản lý CMS (Editor)',
    bg: '#eff6ff',
    color: '#1d4ed8',
    desc: 'Đăng nhập CMS quản lý nội dung',
  },
  user: {
    label: 'Người dùng Web',
    bg: '#f3f4f6',
    color: '#4b5563',
    desc: 'Tài khoản thành viên sử dụng web',
  },
};

export default function AdminUsersTab({ currentAdminEmail, showToast }: AdminUsersTabProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, cmsUsers: 0, webUsers: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'cms' | 'user'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formStatus, setFormStatus] = useState<UserStatus>('active');
  const [formPhone, setFormPhone] = useState('');
  const [formNote, setFormNote] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể tải danh sách người dùng.', 'error');
        return;
      }
      setUsers(Array.isArray(data.users) ? data.users : []);
      if (data.stats) setStats(data.stats);
    } catch {
      showToast('Lỗi kết nối máy chủ khi tải người dùng.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchRole =
        roleFilter === 'all' ||
        (roleFilter === 'cms' ? u.role === 'admin' || u.role === 'editor' : u.role === 'user');
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('user');
    setFormStatus('active');
    setFormPhone('');
    setFormNote('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: AppUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormStatus(u.status);
    setFormPhone(u.phone || '');
    setFormNote(u.note || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const payload = {
        id: editingUser?.id,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword,
        role: formRole,
        status: formStatus,
        phone: formPhone.trim() || null,
        note: formNote.trim() || null,
      };

      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể lưu người dùng.', 'error');
        return;
      }

      showToast(data.message || 'Đã lưu người dùng!');
      setIsModalOpen(false);
      await loadUsers();
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (u: AppUser) => {
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${u.name}" (${u.email})?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể xóa tài khoản.', 'error');
        return;
      }
      showToast(data.message || 'Đã xóa tài khoản.');
      await loadUsers();
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error');
    }
  };

  const handleToggleStatus = async (u: AppUser) => {
    const nextStatus: UserStatus = u.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: nextStatus,
          phone: u.phone || null,
          note: u.note || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể đổi trạng thái.', 'error');
        return;
      }
      showToast(
        nextStatus === 'active'
          ? `Đã kích hoạt tài khoản ${u.email}`
          : `Đã tạm khóa tài khoản ${u.email}`
      );
      await loadUsers();
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#133e2f', margin: 0 }}>
            Quản Lý Người Dùng (CMS & Web)
          </h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
            Tạo và phân quyền tài khoản đăng nhập CMS (Admin / Editor) và quản lý người dùng web.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadUsers}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-arrow-clockwise" aria-hidden="true" /> Tải lại
          </button>
          <button
            type="button"
            onClick={openAddModal}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              background: '#133e2f',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-person-plus-fill" aria-hidden="true" /> + Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Tổng người dùng', val: stats.total, color: '#133e2f', icon: 'bi-people-fill' },
          { label: 'Quản lý CMS (Admin/Editor)', val: stats.cmsUsers, color: '#1d4ed8', icon: 'bi-shield-lock-fill' },
          { label: 'Người dùng Web', val: stats.webUsers, color: '#d97706', icon: 'bi-person-badge' },
          { label: 'Đang hoạt động', val: stats.active, color: '#047857', icon: 'bi-check-circle-fill' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '1.15rem 1.25rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <i className={`bi ${card.icon}`} style={{ color: card.color }} aria-hidden="true" />
              <span>{card.label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: card.color, marginTop: '0.35rem' }}>
              {card.val}
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#fff',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Tất cả (${stats.total})` },
            { id: 'cms', label: `Quản lý CMS (${stats.cmsUsers})` },
            { id: 'user', label: `Người dùng Web (${stats.webUsers})` },
          ].map((pill) => (
            <button
              type="button"
              key={pill.id}
              onClick={() => setRoleFilter(pill.id as any)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: roleFilter === pill.id ? '#133e2f' : '#f3f4f6',
                color: roleFilter === pill.id ? '#fff' : '#4b5563',
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên, email, SĐT..."
          style={{
            padding: '0.55rem 0.9rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '0.85rem',
            minWidth: '240px',
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            <i className="bi bi-hourglass-split" aria-hidden="true" /> Đang tải danh sách người dùng...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Chưa có tài khoản nào phù hợp. Hãy bấm &ldquo;+ Thêm người dùng mới&rdquo; để tạo tài khoản CMS hoặc người dùng web.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
                <th style={{ padding: '0.9rem 1rem' }}>Người dùng</th>
                <th style={{ padding: '0.9rem 1rem' }}>Vai trò</th>
                <th style={{ padding: '0.9rem 1rem' }}>Trạng thái</th>
                <th style={{ padding: '0.9rem 1rem' }}>Đăng nhập gần nhất</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const rMeta = ROLE_META[u.role] || ROLE_META.user;
                const isSelf = u.email.toLowerCase() === currentAdminEmail.toLowerCase();
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#133e2f', display: 'block' }}>
                        {u.name} {isSelf && <span style={{ fontSize: '0.72rem', color: '#047857' }}>(Bạn)</span>}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        {u.email}
                        {u.phone ? ` · ${u.phone}` : ''}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: rMeta.bg,
                          color: rMeta.color,
                        }}
                      >
                        {rMeta.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        disabled={isSelf}
                        title={isSelf ? 'Không thể khóa tài khoản đang đăng nhập' : 'Bấm để bật/khóa nhanh'}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: isSelf ? 'not-allowed' : 'pointer',
                          background: u.status === 'active' ? '#dcfce7' : '#fee2e2',
                          color: u.status === 'active' ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </button>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#6b7280' }}>
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleString('vi-VN')
                        : 'Chưa đăng nhập'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        style={{
                          padding: '0.35rem 0.7rem',
                          marginRight: '0.4rem',
                          borderRadius: '6px',
                          background: '#fff',
                          border: '1px solid #d1d5db',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        disabled={isSelf}
                        style={{
                          padding: '0.35rem 0.7rem',
                          borderRadius: '6px',
                          background: isSelf ? '#f3f4f6' : '#fee2e2',
                          border: isSelf ? '1px solid #e5e7eb' : '1px solid #fca5a5',
                          color: isSelf ? '#9ca3af' : '#b91c1c',
                          cursor: isSelf ? 'not-allowed' : 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <i className="bi bi-trash" aria-hidden="true" /> Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 33, 24, 0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '18px',
              width: '100%',
              maxWidth: '640px',
              padding: '2rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#133e2f', margin: 0 }}>
                {editingUser ? (
                  <><i className="bi bi-pencil-square" aria-hidden="true" /> Chỉnh Sửa Người Dùng</>
                ) : (
                  <><i className="bi bi-person-plus-fill" aria-hidden="true" /> Thêm Người Dùng Mới</>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng"
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280' }}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                    Email đăng nhập *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@quangtri.wiki"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0914..."
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                  {editingUser ? 'Mật khẩu mới (để trống nếu giữ nguyên)' : 'Mật khẩu * (tối thiểu 6 ký tự)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={editingUser ? undefined : 6}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                    Vai trò *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem', background: '#fff' }}
                  >
                    <option value="user">Người dùng Web (User)</option>
                    <option value="editor">Quản lý CMS (Editor)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                    Trạng thái
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem', background: '#fff' }}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>
                  Ghi chú nội bộ
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Phụ trách vùng Đông Hà / Hướng Hóa..."
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '0.65rem 1.35rem', borderRadius: '10px', border: 'none', background: '#133e2f', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSaving ? 'Đang lưu...' : editingUser ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
