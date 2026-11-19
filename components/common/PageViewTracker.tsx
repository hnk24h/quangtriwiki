'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'qt_viewed_paths';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      const viewed: string[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(viewed) && viewed.includes(pathname)) {
        return;
      }

      const next = Array.isArray(viewed) ? [...viewed, pathname] : [pathname];
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      // sessionStorage disabled in strict privacy modes - proceed with POST
    }

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
