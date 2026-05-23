import { useState, useCallback } from 'react';
import type { JournalEntry, Mood } from '../types';

const STORAGE_KEY = 'commute-journal-entries';

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  const addEntry = useCallback(
    (data: {
      mood: Mood;
      reflection: string;
      highlights: string;
      commute: JournalEntry['commute'];
      tags: string[];
    }) => {
      const now = new Date();
      const entry: JournalEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: now.toISOString().slice(0, 10),
        timestamp: now.getTime(),
        ...data,
      };
      setEntries((prev) => {
        const next = [entry, ...prev];
        saveEntries(next);
        return next;
      });
      return entry;
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, data: Partial<Omit<JournalEntry, 'id' | 'timestamp'>>) => {
      setEntries((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
        saveEntries(next);
        return next;
      });
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEntries(next);
      return next;
    });
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry };
}
