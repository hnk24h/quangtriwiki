'use client';

import React from 'react';
import Image from 'next/image';

const OPTIMIZED_HOSTS = new Set(['images.unsplash.com']);

function isOptimizableUrl(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  try {
    const parsed = new URL(src);
    if (OPTIMIZED_HOSTS.has(parsed.hostname)) return true;
    if (parsed.hostname.endsWith('.supabase.co')) return true;
    return false;
  } catch {
    return false;
  }
}

interface SafeImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className,
  style,
}: SafeImageProps) {
  const safeSrc = src && src.trim() ? src.trim() : DEFAULT_FALLBACK;
  const unoptimized = !isOptimizableUrl(safeSrc);

  if (fill) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width || 800}
      height={height || 500}
      sizes={sizes || '(max-width: 768px) 100vw, 400px'}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
      style={style}
    />
  );
}
