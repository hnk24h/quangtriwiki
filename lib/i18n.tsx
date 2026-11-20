'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type SiteLang = 'vi' | 'en' | 'ja';

const LANG_STORAGE_KEY = 'quangtri_lang_v1';

interface LanguageContextValue {
  lang: SiteLang;
  setLang: (next: SiteLang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>('vi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'vi' || saved === 'ja') {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLang = useCallback((next: SiteLang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    const order: SiteLang[] = ['vi', 'en', 'ja'];
    const next = order[(order.indexOf(lang) + 1) % order.length];
    setLang(next);
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Converts a Vietnamese VNĐ price string into a friendly `~USD` (for EN) or `~JPY` (for JA) hint.
 */
export function formatDualCurrency(rawPrice: string | undefined, lang: SiteLang): string {
  if (!rawPrice) return lang === 'en' ? 'Free' : lang === 'ja' ? '無料' : 'Miễn phí';
  if (lang === 'vi') return rawPrice;
  if (/miễn phí/i.test(rawPrice)) return lang === 'ja' ? '無料' : 'Free entry';

  const matches = rawPrice.match(/\d[\d.,]*/g);
  if (!matches || matches.length === 0) return rawPrice;

  const parseVnd = (s: string): number => {
    const cleaned = s.replace(/[.,]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  const first = parseVnd(matches[0]);
  if (first < 1000) return rawPrice;

  if (lang === 'ja') {
    const jpyFirst = Math.max(10, Math.round(first / 165 / 10) * 10);
    if (matches.length >= 2) {
      const second = parseVnd(matches[1]);
      if (second >= 1000) {
        const jpySecond = Math.max(10, Math.round(second / 165 / 10) * 10);
        return `${rawPrice} (~¥${jpyFirst.toLocaleString('en-US')}–¥${jpySecond.toLocaleString('en-US')})`;
      }
    }
    return `${rawPrice} (~¥${jpyFirst.toLocaleString('en-US')})`;
  }

  const usdFirst = Math.max(1, Math.round(first / 25400));
  if (matches.length >= 2) {
    const second = parseVnd(matches[1]);
    if (second >= 1000) {
      const usdSecond = Math.max(1, Math.round(second / 25400));
      return `${rawPrice} (~$${usdFirst}–$${usdSecond} USD)`;
    }
  }
  return `${rawPrice} (~$${usdFirst} USD)`;
}
