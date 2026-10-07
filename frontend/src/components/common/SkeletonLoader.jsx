import React from 'react';

export function CourseCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse border border-slate-200/60 dark:border-slate-800">
      <div className="h-48 bg-slate-200 dark:bg-dark-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-1/3" />
        <div className="h-6 bg-slate-200 dark:bg-dark-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-full" />
        <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-1/4" />
          <div className="h-6 bg-slate-200 dark:bg-dark-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800/60">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded w-4/5" />
        </td>
      ))}
    </tr>
  );
}

export default function SkeletonLoader({ className = '', height = 'h-6', width = 'w-full' }) {
  return (
    <div
      className={`bg-slate-200 dark:bg-dark-800 rounded-lg animate-pulse ${height} ${width} ${className}`}
    />
  );
}
