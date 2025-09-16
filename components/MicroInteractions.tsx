'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, ThumbsUp, Star, Bookmark, Share2 } from 'lucide-react';

// 点击波纹效果
export function RippleButton({ 
  children, 
  onClick, 
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.3)'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  rippleColor?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // 移除波纹
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </button>
  );
}

// 点赞按钮动画
export function LikeButton({ 
  isLiked = false, 
  count = 0, 
  onToggle,
  className = '' 
}: {
  isLiked?: boolean;
  count?: number;
  onToggle?: (liked: boolean) => void;
  className?: string;
}) {
  const [liked, setLiked] = useState(isLiked);
  const [currentCount, setCurrentCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCurrentCount(prev => newLiked ? prev + 1 : prev - 1);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 300);
    onToggle?.(newLiked);
  };

  return (
    <RippleButton
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
        liked 
          ? 'bg-red-500/20 text-red-500 border-red-500/50' 
          : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:text-red-400'
      } border ${className}`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-200 ${
          liked ? 'fill-current' : ''
        } ${isAnimating ? 'animate-bounce' : ''}`} 
      />
      <span className="font-medium">{currentCount}</span>
    </RippleButton>
  );
}

// 收藏按钮动画
export function BookmarkButton({ 
  isBookmarked = false, 
  onToggle,
  className = '' 
}: {
  isBookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
  className?: string;
}) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 400);
    onToggle?.(newBookmarked);
  };

  return (
    <RippleButton
      onClick={handleClick}
      className={`p-3 rounded-full transition-all duration-200 ${
        bookmarked 
          ? 'bg-yellow-500/20 text-yellow-500' 
          : 'bg-gray-500/20 text-gray-400 hover:text-yellow-400'
      } ${className}`}
    >
      <Bookmark 
        className={`w-5 h-5 transition-all duration-200 ${
          bookmarked ? 'fill-current' : ''
        } ${isAnimating ? 'animate-pulse scale-110' : ''}`} 
      />
    </RippleButton>
  );
}

// 分享按钮动画
export function ShareButton({ 
  onShare,
  className = '' 
}: {
  onShare?: () => void;
  className?: string;
}) {
  const [isSharing, setIsSharing] = useState(false);

  const handleClick = () => {
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 1000);
    onShare?.();
  };

  return (
    <RippleButton
      onClick={handleClick}
      className={`p-3 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 ${className}`}
    >
      <Share2 
        className={`w-5 h-5 transition-all duration-200 ${
          isSharing ? 'animate-spin' : ''
        }`} 
      />
    </RippleButton>
  );
}

// 悬浮提示
export function Tooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 500,
  className = '' 
}: {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      setTimeout(() => setIsVisible(true), 10);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setTimeout(() => setShouldShow(false), 150);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {shouldShow && (
        <div
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded-md whitespace-nowrap transition-opacity duration-150 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } ${getPositionClasses()}`}
        >
          {content}
          {/* 箭头 */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          />
        </div>
      )}
    </div>
  );
}

// 数字滚动动画
export function CountUp({ 
  value, 
  duration = 1000, 
  formatter,
  className = '' 
}: {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = count;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, value, duration, count]);

  return (
    <span ref={ref} className={className}>
      {formatter ? formatter(count) : count}
    </span>
  );
}

// 进度条动画
export function ProgressBar({ 
  value, 
  max = 100, 
  animated = true,
  showLabel = false,
  color = 'blue',
  className = '' 
}: {
  value: number;
  max?: number;
  animated?: boolean;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !animated) {
      setCurrentValue(value);
      return;
    }

    const startTime = Date.now();
    const duration = 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newValue = value * easeOutCubic;
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, value, animated]);

  const percentage = (currentValue / max) * 100;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// 浮动操作按钮
export function FloatingActionButton({ 
  icon, 
  onClick, 
  position = 'bottom-right',
  color = 'blue',
  size = 'md',
  className = '' 
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'blue' | 'green' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
    purple: 'bg-purple-500 hover:bg-purple-600'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <RippleButton
      onClick={onClick}
      className={`
        fixed z-50 ${positionClasses[position]} ${sizeClasses[size]} 
        ${colorClasses[color]} text-white rounded-full shadow-lg 
        flex items-center justify-center transition-all duration-200 
        hover:scale-110 active:scale-95 ${className}
      `}
    >
      {icon}
    </RippleButton>
  );
}