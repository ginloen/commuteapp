export type Mood = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
  mood: Mood;
  reflection: string;
  highlights: string;
  commute: 'morning' | 'evening' | 'both';
  tags: string[];
}
