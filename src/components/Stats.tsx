import type { JournalEntry, Mood } from '../types';
import { MOODS } from './MoodPicker';

interface Props {
  entries: JournalEntry[];
}

export function Stats({ entries }: Props) {
  if (entries.length === 0) return null;

  const avg = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
  const rounded = Math.round(avg) as Mood;
  const avgMood = MOODS.find((m) => m.value === rounded)!;

  const streak = calcStreak(entries);

  const moodCounts = MOODS.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.value).length,
  }));

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{entries.length}</span>
        <span className="stat-label">Total Entries</span>
      </div>
      <div className="stat-card">
        <span className="stat-value" style={{ color: avgMood.color }}>
          {avgMood.emoji}
        </span>
        <span className="stat-label">Avg Mood ({avg.toFixed(1)})</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{streak}</span>
        <span className="stat-label">Day Streak 🔥</span>
      </div>
      <div className="stat-card stat-bar-card">
        <span className="stat-label" style={{ marginBottom: 8 }}>Mood Breakdown</span>
        {moodCounts.map((m) => (
          <div key={m.value} className="bar-row">
            <span className="bar-emoji">{m.emoji}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: entries.length ? `${(m.count / entries.length) * 100}%` : '0%',
                  background: m.color,
                }}
              />
            </div>
            <span className="bar-count">{m.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function calcStreak(entries: JournalEntry[]): number {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map((e) => e.date))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  if (dates[0] !== today && dates[0] !== yesterday(today)) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === yesterday(dates[i - 1])) streak++;
    else break;
  }
  return streak;
}

function yesterday(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
