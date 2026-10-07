import React, { useState } from 'react';
import { ChevronDown, PlayCircle, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function CurriculumAccordion({
  sections = [],
  completedLessonIds = [],
  activeLessonId = null,
  onSelectLesson = null,
  interactive = false,
}) {
  const [expandedSections, setExpandedSections] = useState(() => {
    // Expand first section by default
    return { 0: true };
  });

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-3">
      {sections.map((section, sIdx) => {
        const isOpen = !!expandedSections[sIdx];
        const sectionLessons = section.lessons || [];

        return (
          <div
            key={section._id || sIdx}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-dark-850/60 overflow-hidden transition-colors"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sIdx)}
              type="button"
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-dark-800/40 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block mb-0.5">
                  Section {sIdx + 1}
                </span>
                <h4 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                  {section.title}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {sectionLessons.length} lessons
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Section Lessons List */}
            {isOpen && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60">
                {sectionLessons.map((lesson, lIdx) => {
                  const isCompleted = completedLessonIds.some(
                    (id) => id.toString() === (lesson._id || '').toString()
                  );
                  const isActive = activeLessonId && activeLessonId.toString() === (lesson._id || '').toString();

                  return (
                    <div
                      key={lesson._id || lIdx}
                      onClick={() => {
                        if (interactive && onSelectLesson) {
                          onSelectLesson(lesson);
                        }
                      }}
                      className={`px-5 py-3 flex items-center justify-between text-xs sm:text-sm transition-colors ${
                        interactive ? 'cursor-pointer hover:bg-slate-100/70 dark:hover:bg-dark-800/60' : ''
                      } ${
                        isActive
                          ? 'bg-brand-50/80 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : lesson.isFreePreview || interactive ? (
                          <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}

                        <span className="truncate">
                          {lIdx + 1}. {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.isFreePreview && !interactive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40">
                            Preview
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{lesson.duration || '10:00'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
