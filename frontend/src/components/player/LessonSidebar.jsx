import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Award, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LessonSidebar({
  course,
  progress = 0,
  completedLessonIds = [],
  activeLesson = null,
  onSelectLesson,
  onToggleCompleteLesson,
  certificateId = null,
}) {
  return (
    <aside className="w-full lg:w-80 xl:w-96 glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-[650px] lg:h-[calc(100vh-120px)] sticky top-24 overflow-hidden">
      {/* Header with Progress */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-dark-900/50">
        <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-2">
          {course?.title}
        </h3>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Course Completion</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-dark-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress === 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-brand-500 to-indigo-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Certificate Button if finished */}
        {progress === 100 && (
          <Link
            to={certificateId ? `/certificate/${certificateId}` : '#'}
            className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-transform"
          >
            <Award className="w-4 h-4" />
            View Certificate
          </Link>
        )}
      </div>

      {/* Curriculum List (Scrollable) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-2">
        {course?.sections?.map((section, sIdx) => (
          <div key={section._id || sIdx} className="pt-2">
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Section {sIdx + 1}: {section.title}
            </div>

            <div className="space-y-1 mt-1">
              {section.lessons?.map((lesson, lIdx) => {
                const isCompleted = completedLessonIds.some(
                  (id) => id.toString() === (lesson._id || '').toString()
                );
                const isActive = activeLesson && activeLesson._id === lesson._id;

                return (
                  <div
                    key={lesson._id || lIdx}
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60'
                        : 'hover:bg-slate-100/70 dark:hover:bg-dark-800/60 border border-transparent'
                    }`}
                  >
                    {/* Checkbox toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompleteLesson(lesson._id);
                      }}
                      className="mr-2 text-slate-400 hover:text-brand-500 transition-colors"
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    {/* Lesson Title Clickable */}
                    <div
                      onClick={() => onSelectLesson(lesson)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <p
                        className={`text-xs truncate ${
                          isActive
                            ? 'font-bold text-brand-600 dark:text-brand-400'
                            : 'font-medium text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lIdx + 1}. {lesson.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {lesson.duration || '10:00'}
                      </span>
                    </div>

                    {/* Play button */}
                    <button
                      onClick={() => onSelectLesson(lesson)}
                      className={`ml-2 p-1 rounded-lg ${
                        isActive
                          ? 'text-brand-500'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
