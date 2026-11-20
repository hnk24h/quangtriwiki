'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  variant?: 'fade-up' | 'fade-in' | 'scale-up';
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  delayMs = 0,
  variant = 'fade-up',
  className = '',
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sr-block sr-${variant} ${isVisible ? 'is-revealed' : ''} ${className}`.trim()}
      style={{
        transitionDelay: isVisible && delayMs > 0 ? `${delayMs}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
