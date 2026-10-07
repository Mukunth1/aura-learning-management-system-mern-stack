import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-dark-900/90 text-white text-xs border border-slate-700 backdrop-blur-md shadow-xl">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.name.toLowerCase().includes('revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsChart({ data = [], title = 'Growth Overview' }) {
  const [metric, setMetric] = useState('both'); // 'revenue' | 'enrollments' | 'both'

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly progression and enrollment trends
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-dark-850 border border-slate-200 dark:border-slate-700/80">
          <button
            onClick={() => setMetric('both')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              metric === 'both'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              metric === 'revenue'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setMetric('enrollments')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              metric === 'enrollments'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Students
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEnr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {(metric === 'both' || metric === 'revenue') && (
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            )}
            {(metric === 'both' || metric === 'enrollments') && (
              <Area
                type="monotone"
                dataKey="enrollments"
                name="Enrollments"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorEnr)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
