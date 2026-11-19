'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AdminLoginProps {
  onSuccess: (info: { email: string; usingDefaultPassword?: boolean }) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [emailInput, setEmailInput] = useState('admin@quangtri.wiki');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setAuthError(data?.error || 'Email hoặc mật khẩu không đúng.');
        return;
      }

      onSuccess({
        email: data.email || emailInput,
        usingDefaultPassword: Boolean(data.usingDefaultPassword),
      });
    } catch {
      setAuthError('Không thể kết nối máy chủ xác thực. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '390px',
          width: '100%',
          padding: '2.25rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#133e2f',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              marginBottom: '0.85rem',
            }}
          >
            QT
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
            Quản trị viên
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Đăng nhập xác thực máy chủ để quản lý QuangTri.wiki
          </p>
        </div>

        {authError && (
          <div
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.83rem',
              fontWeight: 600,
            }}
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="admin@quangtri.wiki"
              autoComplete="username"
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label
                htmlFor="admin-password"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
              >
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Nhập mật khẩu quản trị"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '0.35rem',
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#133e2f',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'wait' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.1rem' }}>
          <Link href="/" style={{ fontSize: '0.82rem', color: '#64748b', textDecoration: 'none' }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
