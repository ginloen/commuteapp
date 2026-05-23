import type { Mood } from '../types';

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: '😞', label: 'Rough', color: '#ef4444' },
  { value: 2, emoji: '😕', label: 'Meh', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Okay', color: '#eab308' },
  { value: 4, emoji: '😊', label: 'Good', color: '#84cc16' },
  { value: 5, emoji: '😄', label: 'Great', color: '#22c55e' },
];

interface Props {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="mood-picker">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          className={`mood-btn ${value === m.value ? 'selected' : ''}`}
          style={value === m.value ? { borderColor: m.color, background: `${m.color}18` } : {}}
          onClick={() => onChange(m.value)}
          aria-label={m.label}
          title={m.label}
        >
          <span className="mood-emoji">{m.emoji}</span>
          <span className="mood-label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

export { MOODS };
