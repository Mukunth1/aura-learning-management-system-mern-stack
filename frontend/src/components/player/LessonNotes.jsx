import React, { useState, useEffect } from 'react';
import { Save, Download, Trash2, Check } from 'lucide-react';

export default function LessonNotes({ lessonId, lessonTitle = 'Lesson' }) {
  const storageKey = `lms_notes_${lessonId}`;
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const savedNote = localStorage.getItem(storageKey) || '';
    setNote(savedNote);
  }, [lessonId]);

  const handleSave = () => {
    localStorage.setItem(storageKey, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([`# Notes: ${lessonTitle}\n\n${note}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear your notes for this lesson?')) {
      setNote('');
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Personal Study Notes
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Notes are saved automatically in your browser for this lesson.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!note.trim()}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 disabled:opacity-40 transition-colors"
            title="Download Notes as Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            disabled={!note.trim()}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-40 transition-colors"
            title="Clear Notes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {isSaved ? 'Saved' : 'Save Note'}
          </button>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          localStorage.setItem(storageKey, e.target.value);
        }}
        placeholder="Jot down key takeaways, code snippets, or thoughts as you watch..."
        rows={10}
        className="w-full p-4 rounded-2xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors leading-relaxed font-mono"
      />
    </div>
  );
}
