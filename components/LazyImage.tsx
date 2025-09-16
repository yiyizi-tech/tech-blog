'use client';

import { useState, useRef, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  threshold?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  threshold = 0.1,
  placeholder = 'empty',
  blurDataURL
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [priority, shouldLoad, threshold]);

  return (
    <div ref={imgRef} className={className}>
      {shouldLoad ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          fill={fill}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{ width, height }}
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">准备加载...</p>
          </div>
        </div>
      )}
    </div>
  );
}