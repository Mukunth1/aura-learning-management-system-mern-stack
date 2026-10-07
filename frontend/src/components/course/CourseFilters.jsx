import React from 'react';
import { Filter, X, ArrowUpDown, Tag } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'UI/UX Design',
  'Cybersecurity',
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseFilters({
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  priceType,
  onSelectPriceType,
  sortBy,
  onSelectSortBy,
  onResetFilters,
}) {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLevel !== 'All' ||
    priceType !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6">
      {/* Category Horizontal Filter Pills */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 block">
          Disciplines
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-500/20 scale-[1.02]'
                  : 'bg-white/70 dark:bg-dark-850/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Row with Level, Price, and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center gap-3">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => onSelectLevel(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Price:</span>
            <select
              value={priceType}
              onChange={(e) => onSelectPriceType(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Pricing</option>
              <option value="free">Free Courses</option>
              <option value="paid">Premium Paid</option>
            </select>
          </div>
        </div>

        {/* Right side: Sorting & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
