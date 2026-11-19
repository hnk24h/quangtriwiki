import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
        Không tìm thấy trang
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        Địa chỉ bạn đang tìm kiếm có thể đã bị thay đổi hoặc không tồn tại trên hệ thống Cẩm Nang Du Lịch Quảng Trị.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          background: 'var(--primary)',
          color: '#ffffff',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        ← Về Trang Chủ
      </Link>
    </div>
  );
}
