import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { JournalEntry } from '../types';
import { MOODS } from './MoodPicker';

interface Props {
  entries: JournalEntry[];
}

const MOOD_LABELS: Record<number, string> = Object.fromEntries(
  MOODS.map((m) => [m.value, `${m.emoji} ${m.label}`])
);

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-mood">{MOOD_LABELS[val]}</p>
    </div>
  );
}

export function MoodChart({ entries }: Props) {
  if (entries.length < 2) {
    return (
      <div className="chart-placeholder">
        <p>Add at least 2 entries to see your mood trend.</p>
      </div>
    );
  }

  const data = [...entries]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((e) => ({
      date: format(new Date(e.timestamp), 'MMM d'),
      mood: e.mood,
    }));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#moodGradient)"
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
