import { useState, useMemo } from 'react';
import { useJournal } from './hooks/useJournal';
import { NewEntryForm } from './components/NewEntryForm';
import { EntryCard } from './components/EntryCard';
import { MoodChart } from './components/MoodChart';
import { Stats } from './components/Stats';

type View = 'journal' | 'insights' | 'new';

export default function App() {
  const { entries, addEntry, deleteEntry } = useJournal();
  const [view, setView] = useState<View>('journal');
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const q = search.toLowerCase();
      const matchesText =
        !q ||
        e.reflection.toLowerCase().includes(q) ||
        e.highlights.toLowerCase().includes(q) ||
        e.tags.some((t) => t.includes(q));
      const matchesMood = filterMood === null || e.mood === filterMood;
      return matchesText && matchesMood;
    });
  }, [entries, search, filterMood]);

  function handleSave(data: Parameters<typeof addEntry>[0]) {
    addEntry(data);
    setView('journal');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-icon">🚆</span>
            <h1 className="brand-name">Commute Journal</h1>
          </div>
          {view !== 'new' && (
            <button className="btn-primary" onClick={() => setView('new')}>
              + New Entry
            </button>
          )}
        </div>
        {view !== 'new' && (
          <nav className="tab-nav">
            <button
              className={`tab ${view === 'journal' ? 'active' : ''}`}
              onClick={() => setView('journal')}
            >
              Journal
            </button>
            <button
              className={`tab ${view === 'insights' ? 'active' : ''}`}
              onClick={() => setView('insights')}
            >
              Insights
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">
        {view === 'new' && (
          <NewEntryForm onSave={handleSave} onCancel={() => setView('journal')} />
        )}

        {view === 'journal' && (
          <div className="journal-view">
            {entries.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">📓</span>
                <h2>Start your journal</h2>
                <p>Capture how your day went during your commute.</p>
                <button className="btn-primary" onClick={() => setView('new')}>
                  Write First Entry
                </button>
              </div>
            )}

            {entries.length > 0 && (
              <>
                <div className="filter-bar">
                  <input
                    className="text-input search-input"
                    placeholder="Search entries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="mood-filter">
                    {([null, 1, 2, 3, 4, 5] as (number | null)[]).map((v) => (
                      <button
                        key={String(v)}
                        className={`mood-filter-btn ${filterMood === v ? 'active' : ''}`}
                        onClick={() => setFilterMood(v)}
                      >
                        {v === null ? 'All' : ['😞', '😕', '😐', '😊', '😄'][(v as number) - 1]}
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <p className="no-results">No entries match your search.</p>
                ) : (
                  <div className="entry-list">
                    {filtered.map((e) => (
                      <EntryCard key={e.id} entry={e} onDelete={deleteEntry} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'insights' && (
          <div className="insights-view">
            <Stats entries={entries} />
            <section className="chart-section">
              <h2 className="section-title">Mood Over Time</h2>
              <MoodChart entries={entries} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
