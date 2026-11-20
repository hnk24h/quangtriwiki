'use client';

import React, { useEffect, useState } from 'react';

export type CmsEntityType =
  | 'banners'
  | 'zones'
  | 'places'
  | 'services'
  | 'foods'
  | 'itineraries'
  | 'threads'
  | 'hotlines'
  | 'gas';

interface AdminEditorModalProps {
  isOpen: boolean;
  editingType: CmsEntityType | null;
  editingItem: any;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  boxSizing: 'border-box',
  fontSize: '0.9rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  marginBottom: '0.3rem',
  color: '#374151',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  lineHeight: 1.6,
  resize: 'vertical',
};

function compressImageToDataUrl(file: File, maxDim = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('File ảnh không hợp lệ'));
      img.onload = () => {
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
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function ImageInputField({
  name,
  label,
  defaultValue = '',
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>(
    defaultValue.startsWith('data:image/') ? 'upload' : 'url'
  );
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
    setMode(defaultValue.startsWith('data:image/') ? 'upload' : 'url');
  }, [defaultValue]);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setValue(dataUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <div style={{ display: 'inline-flex', background: '#f3f4f6', padding: '2px', borderRadius: '8px', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '0.22rem 0.6rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'url' ? '#133e2f' : 'transparent',
              color: mode === 'url' ? '#fff' : '#4b5563',
            }}
          >
            <i className="bi bi-link-45deg" aria-hidden="true" /> Nhập URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '0.22rem 0.6rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'upload' ? '#133e2f' : 'transparent',
              color: mode === 'upload' ? '#fff' : '#4b5563',
            }}
          >
            <i className="bi bi-cloud-arrow-up" aria-hidden="true" /> Tải ảnh lên
          </button>
        </div>
      </div>

      {/* Hidden input keeps exact FormData key */}
      <input type="hidden" name={name} value={value} />

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          {mode === 'url' ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required={required}
              placeholder="https://... hoặc /images/..."
              style={inputStyle}
            />
          ) : (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                border: '1px dashed #059669',
                background: '#f0fdf4',
                color: '#133e2f',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <i className="bi bi-image" aria-hidden="true" />
              <span>{uploading ? 'Đang nén ảnh...' : value ? 'Chọn ảnh khác từ máy' : 'Chọn ảnh từ máy để tải lên'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFile(e.target.files);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>

        {value && (
          <div style={{ position: 'relative', width: '58px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d1d5db', flexShrink: 0, background: '#f8fafc' }}>
            <img src={value} alt="Xem trước" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
      </div>
    </div>
  );
}

function MultiImageTextareaField({
  name,
  label,
  defaultValue = '',
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const lines = value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const handleUploadMany = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const encoded = await Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith('image/'))
          .slice(0, 8)
          .map((f) => compressImageToDataUrl(f))
      );
      if (encoded.length > 0) {
        const merged = [...lines, ...encoded].join('\n');
        setValue(merged);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => {
    setValue(lines.filter((_, i) => i !== idx).join('\n'));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.28rem 0.7rem',
            borderRadius: '8px',
            border: '1px solid #059669',
            background: '#f0fdf4',
            color: '#133e2f',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
          <span>{uploading ? 'Đang tải...' : 'Tải thêm ảnh từ máy'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              handleUploadMany(e.target.files);
              e.target.value = '';
            }}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder="Dán mỗi dòng 1 URL ảnh hoặc bấm 'Tải thêm ảnh từ máy' ở trên"
        style={textareaStyle}
      />

      {lines.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {lines.map((src, idx) => (
            <div key={`multi-${idx}`} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d1d5db', background: '#f8fafc' }}>
              <img src={src} alt={`Ảnh ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Xóa ảnh"
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.72)',
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
    </div>
  );
}

export default function AdminEditorModal({
  isOpen,
  editingType,
  editingItem,
  isSaving,
  onClose,
  onSubmit,
}: AdminEditorModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !editingType) return null;

  const titleLabel: Record<CmsEntityType, string> = {
    banners: 'Slide Trang Top (Banner)',
    zones: 'Khu Vực & Tọa Độ Thời Tiết',
    places: 'Điểm Đến / Danh Thắng',
    services: 'Dịch Vụ & Đối Tác',
    foods: 'Món Ăn Đặc Sản',
    itineraries: 'Lộ Trình Cung Đường',
    threads: 'Bài Viết / Cẩm Nang',
    hotlines: 'Hotline Khẩn Cấp',
    gas: 'Cây Xăng Tuyến Đường',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '880px',
          width: '96%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#133e2f', margin: 0 }}>
            {editingItem ? <><i className="bi bi-pencil-square" aria-hidden="true" /> Chỉnh Sửa</> : <><i className="bi bi-plus-lg" aria-hidden="true" /> Thêm Mới</>} {titleLabel[editingType]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
          >
            ×
          </button>
        </div>

        <form
          key={`${editingType}-${editingItem?.id || editingItem?.code || 'new'}-${isOpen}`}
          onSubmit={onSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {editingType === 'banners' && (
            <>
              <div>
                <label style={labelStyle}>Tiêu đề slide *</label>
                <input name="title" defaultValue={editingItem?.title || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Thẻ nhãn (Badge) *</label>
                <input name="badge" defaultValue={editingItem?.badge || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Giới thiệu ngắn (Subtitle) *</label>
                <textarea name="subtitle" defaultValue={editingItem?.subtitle || ''} required rows={4} style={textareaStyle} />
              </div>
              <ImageInputField
                name="image"
                label="Hình ảnh nền (URL hoặc Tải lên) *"
                defaultValue={editingItem?.image || ''}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Mã vùng (QT-01..QT-12)</label>
                  <input name="zoneCode" defaultValue={editingItem?.zoneCode || ''} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Thứ tự hiển thị</label>
                  <input name="sortOrder" type="number" defaultValue={editingItem?.sortOrder ?? 0} style={inputStyle} />
                </div>
              </div>
            </>
          )}

          {editingType === 'places' && (
            <>
              <div>
                <label style={labelStyle}>Tên địa danh *</label>
                <input name="name" defaultValue={editingItem?.name || ''} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Mã vùng (QT-01 ... QT-12) *</label>
                  <input name="zoneCode" defaultValue={editingItem?.zoneCode || editingItem?.zone_code || 'QT-01'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tên phân vùng *</label>
                  <input name="zoneName" defaultValue={editingItem?.zoneName || editingItem?.zone_name || 'Đông Hà'} required style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Danh mục (history/adventure/beach/island/nature) *</label>
                  <input name="category" defaultValue={editingItem?.category || 'history'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tên danh mục hiển thị *</label>
                  <input name="categoryName" defaultValue={editingItem?.categoryName || editingItem?.category_name || 'Di tích lịch sử'} required style={inputStyle} />
                </div>
              </div>
              <ImageInputField
                name="image"
                label="Hình ảnh chính (URL hoặc Tải lên) *"
                defaultValue={editingItem?.image || editingItem?.hero_image || ''}
                required
              />
              <MultiImageTextareaField
                name="gallery"
                label="Thư viện ảnh thực tế (mỗi dòng 1 link hoặc tải nhiều ảnh)"
                defaultValue={Array.isArray(editingItem?.gallery) ? editingItem.gallery.join('\n') : ''}
                rows={3}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Giá vé</label>
                  <input name="ticket" defaultValue={editingItem?.ticket || 'Miễn phí'} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tọa độ GPS</label>
                  <input name="coordinates" defaultValue={editingItem?.coordinates || '16.7533° N, 107.1912° E'} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Giờ mở cửa</label>
                  <input name="openHours" defaultValue={editingItem?.openHours || '07:00 - 17:30'} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Địa chỉ cụ thể</label>
                  <input name="address" defaultValue={editingItem?.address || ''} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mô tả ngắn</label>
                <textarea name="shortDesc" defaultValue={editingItem?.shortDesc || ''} rows={3} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nội dung lịch sử & chi tiết</label>
                <textarea name="fullDesc" defaultValue={editingItem?.fullDesc || ''} rows={6} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Điểm nhấn nổi bật (mỗi dòng 1 ý)</label>
                <textarea name="highlights" defaultValue={Array.isArray(editingItem?.highlights) ? editingItem.highlights.join('\n') : ''} rows={4} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Lời khuyên phượt thủ (Tips)</label>
                <textarea name="tips" defaultValue={editingItem?.tips || ''} rows={3} style={textareaStyle} />
              </div>
            </>
          )}

          {editingType === 'threads' && (
            <>
              <div>
                <label style={labelStyle}>Tiêu đề bài viết *</label>
                <input name="title" defaultValue={editingItem?.title || ''} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Tác giả *</label>
                  <input name="author" defaultValue={editingItem?.author || 'Ban Quản Trị'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Huy hiệu tác giả</label>
                  <input name="badge" defaultValue={editingItem?.badge || 'Biên tập viên'} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Chuyên mục / Thẻ *</label>
                  <input name="tag" defaultValue={editingItem?.tag || 'Kinh nghiệm'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mã phân vùng</label>
                  <input name="zoneCode" defaultValue={editingItem?.zoneCode || 'QT-05'} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Nội dung bài viết *</label>
                <textarea name="content" defaultValue={editingItem?.content || ''} rows={9} required style={textareaStyle} />
              </div>
              <MultiImageTextareaField
                name="images"
                label="Danh sách hình ảnh (mỗi dòng 1 URL hoặc tải ảnh lên)"
                defaultValue={Array.isArray(editingItem?.images) ? editingItem.images.join('\n') : ''}
                rows={3}
              />
            </>
          )}

          {editingType === 'services' && (
            <>
              <div>
                <label style={labelStyle}>Tên cơ sở / Dịch vụ *</label>
                <input name="name" defaultValue={editingItem?.name || ''} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Loại dịch vụ (homestay / bike / boat / tour) *</label>
                  <input name="type" defaultValue={editingItem?.type || 'homestay'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tên loại hiển thị *</label>
                  <input name="typeLabel" defaultValue={editingItem?.typeLabel || 'Homestay & Glamping'} required style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Mã vùng (QT-01..QT-12)</label>
                  <input name="zoneCode" defaultValue={editingItem?.zoneCode || 'QT-05'} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tên vùng</label>
                  <input name="zoneName" defaultValue={editingItem?.zoneName || 'Hướng Hóa - Khe Sanh'} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Giá niêm yết *</label>
                  <input name="price" defaultValue={editingItem?.price || '350.000 VNĐ / đêm'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Hotline *</label>
                  <input name="phone" defaultValue={editingItem?.phone || editingItem?.hotline || ''} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Địa chỉ</label>
                <input name="address" defaultValue={editingItem?.address || ''} style={inputStyle} />
              </div>
              <ImageInputField
                name="image"
                label="Hình ảnh dịch vụ (URL hoặc Tải lên) *"
                defaultValue={editingItem?.image || ''}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="verified" id="verified" defaultChecked={editingItem?.verified ?? true} />
                <label htmlFor="verified" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                  Đã xác minh uy tín bản địa
                </label>
              </div>
            </>
          )}

          {editingType === 'foods' && (
            <>
              <div>
                <label style={labelStyle}>Tên món ăn *</label>
                <input name="name" defaultValue={editingItem?.name || ''} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Xuất xứ vùng *</label>
                  <input name="origin" defaultValue={editingItem?.origin || 'Quảng Trị'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mức giá *</label>
                  <input name="priceRange" defaultValue={editingItem?.priceRange || '25.000 - 45.000 VNĐ'} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phân loại món</label>
                <input name="type" defaultValue={editingItem?.type || 'Món mặn truyền thống'} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Quán ngon gợi ý (mỗi dòng 1 quán) *</label>
                <textarea name="addressRecs" defaultValue={Array.isArray(editingItem?.addressRecs) ? editingItem.addressRecs.join('\n') : 'Chợ Đông Hà'} rows={3} required style={textareaStyle} />
              </div>
              <ImageInputField
                name="image"
                label="Hình ảnh món ăn (URL hoặc Tải lên) *"
                defaultValue={editingItem?.image || ''}
                required
              />
              <div>
                <label style={labelStyle}>Mô tả hương vị & cách thưởng thức</label>
                <textarea name="description" defaultValue={editingItem?.description || ''} rows={5} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ghi chú hương vị (Taste notes)</label>
                <input name="tasteNotes" defaultValue={editingItem?.tasteNotes || ''} style={inputStyle} />
              </div>
            </>
          )}

          {editingType === 'itineraries' && (
            <>
              <div>
                <label style={labelStyle}>Tiêu đề lộ trình *</label>
                <input name="title" defaultValue={editingItem?.title || ''} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Thời lượng *</label>
                  <input name="duration" defaultValue={editingItem?.duration || '2N1Đ'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Đối tượng *</label>
                  <input name="suitability" defaultValue={editingItem?.suitability || 'Phượt thủ'} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Khoảng cách</label>
                  <input name="distance" defaultValue={editingItem?.distance || '180km'} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mô tả hành trình</label>
                <textarea name="description" defaultValue={editingItem?.description || ''} rows={3} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Danh sách trạm dừng nổi bật (mỗi dòng một trạm)</label>
                <textarea name="highlights" defaultValue={Array.isArray(editingItem?.highlights) ? editingItem.highlights.join('\n') : ''} rows={4} style={textareaStyle} />
              </div>
              <div>
                <label style={labelStyle}>Chi tiết từng chặng (mỗi dòng định dạng: Thời gian | Tên chặng | Mô tả)</label>
                <textarea
                  name="stepsText"
                  defaultValue={
                    Array.isArray(editingItem?.steps || editingItem?.stops)
                      ? (editingItem.steps || editingItem.stops)
                          .map((s: any) => `${s.time || ''} | ${s.name || ''} | ${s.desc || ''}`)
                          .join('\n')
                      : ''
                  }
                  rows={6}
                  placeholder="07:00 - 09:00 | Xuất phát Đông Hà | Đổ đầy bình xăng..."
                  style={textareaStyle}
                />
              </div>
            </>
          )}

          {editingType === 'hotlines' && (
            <>
              <div>
                <label style={labelStyle}>Tên đơn vị / Đội cứu hộ *</label>
                <input name="name" defaultValue={editingItem?.name || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Số điện thoại *</label>
                <input name="phone" defaultValue={editingItem?.phone || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ghi chú phạm vi hỗ trợ</label>
                <input name="note" defaultValue={editingItem?.note || 'Hỗ trợ 24/7'} style={inputStyle} />
              </div>
            </>
          )}

          {editingType === 'gas' && (
            <>
              <div>
                <label style={labelStyle}>Tên trạm xăng *</label>
                <input name="name" defaultValue={editingItem?.name || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tuyến đường / Vị trí *</label>
                <input name="route" defaultValue={editingItem?.route || ''} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Lưu ý tiếp nhiên liệu</label>
                <input name="tip" defaultValue={editingItem?.tip || 'Nên đổ đầy bình trước khi lên đèo'} style={inputStyle} />
              </div>
            </>
          )}

          {editingType === 'zones' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Mã khu vực (QT-01...QT-09) *</label>
                  <input
                    name="code"
                    defaultValue={editingItem?.code || ''}
                    required
                    readOnly={Boolean(editingItem?.code)}
                    placeholder="QT-09"
                    style={{
                      ...inputStyle,
                      background: editingItem?.code ? '#f3f4f6' : '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tên khu vực *</label>
                  <input name="name" defaultValue={editingItem?.name || ''} required placeholder="Hướng Hóa & Khe Sanh" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Đường dẫn Slug *</label>
                  <input name="slug" defaultValue={editingItem?.slug || ''} required placeholder="huong-hoa-khe-sanh" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Điểm nổi bật ngắn</label>
                  <input name="featuredCount" defaultValue={editingItem?.featuredCount || ''} placeholder="9 điểm check-in · Cafe" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tagline mô tả nhanh</label>
                <input name="tagline" defaultValue={editingItem?.tagline || ''} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Đặc sản địa phương nổi bật</label>
                <input name="specialty" defaultValue={editingItem?.specialty || ''} placeholder="Ví dụ: Cà phê Arabica Khe Sanh & Thịt trâu lá trơng" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Nhãn loại hình (Badge)</label>
                  <input name="typeTag" defaultValue={editingItem?.typeTag || '🏛️ Di tích lịch sử'} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nhóm phân loại</label>
                  <select name="typeGroup" defaultValue={editingItem?.typeGroup || 'history'} style={inputStyle}>
                    <option value="history">Di tích lịch sử & Tâm linh</option>
                    <option value="mountain">Núi cao & Săn mây</option>
                    <option value="coastal">Biển đảo & Sinh thái</option>
                  </select>
                </div>
              </div>

              <ImageInputField
                name="heroImage"
                label="Ảnh nền khu vực (URL hoặc Tải lên) *"
                defaultValue={editingItem?.heroImage || ''}
                required
              />

              <div>
                <label style={labelStyle}>Mô tả chi tiết khu vực</label>
                <textarea name="description" defaultValue={editingItem?.description || editingItem?.desc || ''} rows={4} style={textareaStyle} />
              </div>

              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#133e2f', marginBottom: '0.65rem' }}>
                  <i className="bi bi-cloud-sun" aria-hidden="true" /> Cấu Hình Thời Tiết Thực Tế (Open-Meteo GPS)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.65rem' }}>
                  <div>
                    <label style={labelStyle}>Vĩ độ (Latitude)</label>
                    <input name="lat" type="number" step="any" defaultValue={editingItem?.lat ?? 16.8163} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Kinh độ (Longitude)</label>
                    <input name="lon" type="number" step="any" defaultValue={editingItem?.lon ?? 107.1003} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '0.65rem' }}>
                  <label style={labelStyle}>Nhãn vùng hiển thị trên Widget Thời tiết</label>
                  <input name="weatherRegionLabel" defaultValue={editingItem?.weatherRegionLabel || ''} placeholder="VÙNG CAO · ĐÈO SA MÙ" style={inputStyle} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#047857', cursor: 'pointer' }}>
                  <input type="checkbox" name="showInWeather" defaultChecked={editingItem?.showInWeather ?? true} />
                  Hiển thị trong hộp Thời tiết trang Top
                </label>
              </div>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1rem',
              borderTop: '1px solid #f3f4f6',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.15rem', borderRadius: '8px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 700 }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{ padding: '0.6rem 1.35rem', borderRadius: '8px', background: '#133e2f', color: '#ffffff', border: 'none', fontWeight: 800, cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu vào Database ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
