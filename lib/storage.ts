'use client';

export const STORAGE_KEYS = {
  BOOKMARKS: 'qt_bookmarks',
  ITINERARIES: 'qt_saved_itineraries',
  NOTES: 'qt_personal_notes',
  CHECKLIST: 'qt_packing_checklist',
  ESTIMATE: 'qt_saved_estimate',
} as const;

const LEGACY_KEYS = {
  NOTES: 'qt_notes',
  CHECKLIST: 'qt_checklist',
} as const;

const SYNC_EVENT = 'qt-storage-sync';

function emitSync() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function subscribeStorageSync(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(SYNC_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(SYNC_EVENT, handler);
  };
}

export function getBookmarkedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function setBookmarkedIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
    emitSync();
  } catch {
    // ignore quota errors
  }
}

export function toggleBookmarkId(id: string): { ids: string[]; added: boolean } {
  const current = getBookmarkedIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  setBookmarkedIds(next);
  return { ids: next, added: !exists };
}

export function getPersonalNotes(): string {
  if (typeof window === 'undefined') return '';
  try {
    const current = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (current !== null) return current;
    const legacy = localStorage.getItem(LEGACY_KEYS.NOTES);
    if (legacy !== null) {
      localStorage.setItem(STORAGE_KEYS.NOTES, legacy);
      return legacy;
    }
  } catch {
    // ignore
  }
  return '';
}

export function savePersonalNotes(notes: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, notes);
    emitSync();
  } catch {
    // ignore
  }
}

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export function getPackingChecklist(defaultTexts: string[]): ChecklistItem[] {
  if (typeof window === 'undefined') {
    return defaultTexts.map((text) => ({ text, done: false }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // One-time migration from legacy object map qt_checklist
    const legacyRaw = localStorage.getItem(LEGACY_KEYS.CHECKLIST);
    if (legacyRaw) {
      const legacyMap = JSON.parse(legacyRaw);
      const migrated = defaultTexts.map((text, idx) => ({
        text,
        done: Boolean(legacyMap?.[`chk-${idx}`]),
      }));
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // ignore
  }
  return defaultTexts.map((text) => ({ text, done: false }));
}

export function savePackingChecklist(list: ChecklistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(list));
    emitSync();
  } catch {
    // ignore
  }
}
