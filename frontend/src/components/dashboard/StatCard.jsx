import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle = '',
  icon: Icon,
  color = 'brand',
  trend = null, // e.g. "+14% vs last month"
  trendType = 'up',
}) {
  const colorMap = {
    brand: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-semibold pt-1">
            {trendType === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}>
              {trend}
            </span>
          </div>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-2xl border ${colorMap[color] || colorMap.brand}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
