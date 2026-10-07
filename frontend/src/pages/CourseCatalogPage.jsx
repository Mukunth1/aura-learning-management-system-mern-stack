import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, List, Sparkles, BookOpen } from 'lucide-react';
import CourseCard from '../components/course/CourseCard';
import CourseFilters from '../components/course/CourseFilters';
import { CourseCardSkeleton } from '../components/common/SkeletonLoader';
import { courseService } from '../services/courseService';

export default function CourseCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter States
  const searchKeyword = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedLevel = searchParams.get('level') || 'All';
  const priceType = searchParams.get('priceType') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(searchKeyword);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchKeyword || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        priceType: priceType !== 'all' ? priceType : undefined,
        sort: sortBy,
        limit: 24,
      };

      const res = await courseService.getCourses(params);
      if (res.success) {
        setCourses(res.courses || []);
        setTotalCourses(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchKeyword, selectedCategory, selectedLevel, priceType, sortBy]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Curated Knowledge Repository
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
          Explore Production Masterclasses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Level up your software engineering, AI, and systems architecture skills with comprehensive interactive curricula.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title, technology, topic, or keyword..."
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-brand-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Filter Component */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
        <CourseFilters
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => updateParam('category', cat)}
          selectedLevel={selectedLevel}
          onSelectLevel={(lvl) => updateParam('level', lvl)}
          priceType={priceType}
          onSelectPriceType={(p) => updateParam('priceType', p)}
          sortBy={sortBy}
          onSelectSortBy={(s) => updateParam('sort', s)}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Top Results Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          Showing <span className="font-bold text-slate-900 dark:text-white">{courses.length}</span> of {totalCourses} courses
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-dark-750 text-brand-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-dark-750 text-brand-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CourseCardSkeleton key={idx} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">
            No matching courses found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting different disciplines, or clearing your active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
