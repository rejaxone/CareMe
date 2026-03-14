import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export function RatingStars({ rating, max = 5, size = 'md', showNumber = false, reviewCount }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <div key={i} className="relative">
            <Star className={`${sizeClasses[size]} text-gray-200 fill-gray-200`} />
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
              </div>
            )}
          </div>
        );
      })}
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && <span className="text-gray-400"> ({reviewCount})</span>}
        </span>
      )}
    </div>
  );
}
