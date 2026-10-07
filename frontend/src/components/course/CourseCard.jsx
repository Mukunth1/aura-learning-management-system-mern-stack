import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Play, Award, CheckCircle } from 'lucide-react';
import CardTilt3D from '../3d/CardTilt3D';
import StarRating from '../common/StarRating';

export default function CourseCard({ course, enrollment = null }) {
  if (!course) return null;

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress || 0;
  const isCompleted = enrollment?.status === 'completed' || progress === 100;

  // Calculate total lessons
  let totalLessons = 0;
  if (course.sections) {
    course.sections.forEach((sec) => {
      if (sec.lessons) totalLessons += sec.lessons.length;
    });
  }

  const courseLink = isEnrolled
    ? `/learn/${course._id}`
    : `/course/${course.slug || course._id}`;

  return (
    <CardTilt3D maxTilt={6} className="h-full">
      <div className="glass-card h-full rounded-2xl overflow-hidden flex flex-col group border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all duration-300">
        {/* Thumbnail Image Container */}
        <Link to={courseLink} className="relative aspect-video overflow-hidden bg-slate-900 block">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-dark-900/85 text-brand-300 backdrop-blur-md border border-white/10 shadow-sm">
              {course.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/90 dark:bg-dark-950/90 text-slate-800 dark:text-slate-200 backdrop-blur-md">
              {course.level}
            </span>
          </div>

          {/* Hover Play Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Instructor meta */}
            <div className="flex items-center gap-2 mb-2.5">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={course.instructor?.name || 'Instructor'}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                {course.instructor?.name || 'Master Instructor'}
              </span>
            </div>

            {/* Course Title */}
            <Link to={courseLink} className="block group-hover:text-brand-500 transition-colors">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
                {course.title}
              </h3>
            </Link>

            {/* Subtitle / summary */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {course.subtitle}
            </p>
          </div>

          {/* Footer Area */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            {/* If Enrolled: Show Progress Bar */}
            {isEnrolled ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Completed
                      </>
                    ) : (
                      'In Progress'
                    )}
                  </span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-dark-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Link
                  to={courseLink}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-300 text-xs font-semibold transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {isCompleted ? 'Review Course' : 'Resume Learning'}
                </Link>
              </div>
            ) : (
              /* Public Course Metadata & Pricing */
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <StarRating rating={course.rating || 5} reviewsCount={course.numReviews || 0} size="sm" />
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {(course.studentsCount || 0).toLocaleString()}
                    </span>
                    {totalLessons > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalLessons} lessons
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right">
                  {course.isFree || course.price === 0 ? (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40">
                      FREE
                    </span>
                  ) : (
                    <div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                        ${course.discountPrice > 0 ? course.discountPrice.toFixed(2) : course.price.toFixed(2)}
                      </div>
                      {course.discountPrice > 0 && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardTilt3D>
  );
}
