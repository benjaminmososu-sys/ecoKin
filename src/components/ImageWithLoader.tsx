import { useState } from 'react';
import { motion } from 'motion/react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithLoader({ src, alt, className = '' }: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* Shimmer/Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="w-full h-full bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          {/* Subtle loading spinner */}
          <div className="absolute border-2 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
          <span className="text-2xl">⚠️</span>
          <span className="text-xs mt-1">Image non disponible</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${className}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 0.95,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}
