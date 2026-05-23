import { format } from 'date-fns';
import type { JournalEntry } from '../types';
import { MOODS } from './MoodPicker';

interface Props {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

const COMMUTE_LABEL = { morning: '🌅 Morning', evening: '🌆 Evening', both: '🔄 Both' };

export function EntryCard({ entry, onDelete }: Props) {
  const mood = MOODS.find((m) => m.value === entry.mood)!;
  const dateLabel = format(new Date(entry.timestamp), 'EEEE, MMM d yyyy');

  return (
    <article className="entry-card">
      <div className="entry-header">
        <div className="entry-meta">
          <span className="entry-date">{dateLabel}</span>
          <span className="entry-commute">{COMMUTE_LABEL[entry.commute]}</span>
        </div>
        <div className="entry-mood" style={{ color: mood.color }}>
          <span className="mood-emoji-lg">{mood.emoji}</span>
          <span className="mood-name">{mood.label}</span>
        </div>
      </div>

      {entry.highlights && (
        <div className="entry-section">
          <span className="entry-section-label">Highlights</span>
          <p>{entry.highlights}</p>
        </div>
      )}

      {entry.reflection && (
        <div className="entry-section">
          <span className="entry-section-label">Reflection</span>
          <p>{entry.reflection}</p>
        </div>
      )}

      {entry.tags.length > 0 && (
        <div className="tag-list">
          {entry.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <div className="entry-footer">
        <button
          className="btn-danger-sm"
          onClick={() => {
            if (confirm('Delete this entry?')) onDelete(entry.id);
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
