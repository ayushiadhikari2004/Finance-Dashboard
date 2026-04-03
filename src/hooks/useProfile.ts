import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard_profile_name';

export function useProfile() {
  const [name, setName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? 'Ayushi';
     }
    catch {
        return 'Ayushi'
        ; }
      });

  const saveName = (newName: string) => {
    const trimmed = newName.trim() || 'Ayushi';
    setName(trimmed);
    try { localStorage.setItem(STORAGE_KEY, trimmed); } catch { /* ignore */ }
  };

  return { name, saveName };
}
