import { useState } from 'react';
import type { Mood, JournalEntry } from '../types';
import { MoodPicker } from './MoodPicker';

interface Props {
  onSave: (data: {
    mood: Mood;
    reflection: string;
    highlights: string;
    commute: JournalEntry['commute'];
    tags: string[];
  }) => void;
  onCancel?: () => void;
}

export function NewEntryForm({ onSave, onCancel }: Props) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [reflection, setReflection] = useState('');
  const [highlights, setHighlights] = useState('');
  const [commute, setCommute] = useState<JournalEntry['commute']>('both');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) return;
    onSave({ mood, reflection, highlights, commute, tags });
  }

  const canSubmit = mood !== null && (reflection.trim() || highlights.trim());

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <h2 className="form-title">New Entry</h2>

      <label className="field-label">How was your day?</label>
      <MoodPicker value={mood} onChange={setMood} />

      <label className="field-label" htmlFor="commute-select">Commute</label>
      <select
        id="commute-select"
        className="select-input"
        value={commute}
        onChange={(e) => setCommute(e.target.value as JournalEntry['commute'])}
      >
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
        <option value="both">Both</option>
      </select>

      <label className="field-label" htmlFor="highlights">Highlights</label>
      <textarea
        id="highlights"
        className="textarea-input"
        placeholder="What went well today?"
        value={highlights}
        onChange={(e) => setHighlights(e.target.value)}
        rows={2}
      />

      <label className="field-label" htmlFor="reflection">Reflection</label>
      <textarea
        id="reflection"
        className="textarea-input"
        placeholder="Anything on your mind? How are you feeling?"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={4}
      />

      <label className="field-label">Tags</label>
      <div className="tag-input-row">
        <input
          className="text-input"
          placeholder="Add a tag..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(); }
          }}
        />
        <button type="button" className="btn-secondary" onClick={addTag}>Add</button>
      </div>
      {tags.length > 0 && (
        <div className="tag-list">
          {tags.map((t) => (
            <span key={t} className="tag">
              {t}
              <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          Save Entry
        </button>
      </div>
    </form>
  );
}
