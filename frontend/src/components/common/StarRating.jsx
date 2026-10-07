import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, reviewsCount = null, size = 'sm' }) {
  const numRating = Number(rating) || 5;
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              numRating >= star
                ? 'fill-amber-400 text-amber-400'
                : numRating >= star - 0.5
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
        {numRating.toFixed(1)}
      </span>
      {reviewsCount !== null && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
