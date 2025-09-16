'use client';

import { useEffect, useRef, useState } from 'react';

// 淡入动画
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  direction = 'up',
  className = '' 
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up': return 'translate3d(0, 30px, 0)';
      case 'down': return 'translate3d(0, -30px, 0)';
      case 'left': return 'translate3d(30px, 0, 0)';
      case 'right': return 'translate3d(-30px, 0, 0)';
      default: return 'translate3d(0, 30px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

// 悬浮动画
export function HoverEffect({ 
  children, 
  scale = 1.05, 
  duration = 0.2,
  className = '' 
}: {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={`transition-transform duration-${Math.round(duration * 1000)} ease-out hover:scale-${Math.round(scale * 100)} ${className}`}
      style={{
        willChange: 'transform',
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}

// 弹性动画
export function Bounce({ 
  children, 
  trigger = false, 
  duration = 0.6,
  className = '' 
}: {
  children: React.ReactNode;
  trigger?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: trigger ? `bounce ${duration}s ease-in-out` : undefined,
        willChange: 'transform'
      }}
    >
      {children}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -15px, 0);
          }
          70% {
            transform: translate3d(0, -7px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
}

// 脉冲动画
export function Pulse({ 
  children, 
  duration = 2, 
  intensity = 1.1,
  className = '' 
}: {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `pulse ${duration}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        willChange: 'transform'
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(${intensity});
          }
        }
      `}</style>
    </div>
  );
}

// 旋转加载动画
export function Spinner({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full animate-spin ${className}`}
      style={{ willChange: 'transform' }}
    />
  );
}

// 打字机效果
export function Typewriter({ 
  text, 
  speed = 50, 
  delay = 0,
  className = '' 
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
      }
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

// 滑动展开动画
export function SlideReveal({ 
  children, 
  direction = 'left', 
  duration = 0.5,
  className = '' 
}: {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  className?: string;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getClipPath = () => {
    if (!isRevealed) {
      switch (direction) {
        case 'left': return 'inset(0 100% 0 0)';
        case 'right': return 'inset(0 0 0 100%)';
        case 'up': return 'inset(100% 0 0 0)';
        case 'down': return 'inset(0 0 100% 0)';
        default: return 'inset(0 100% 0 0)';
      }
    }
    return 'inset(0 0 0 0)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: getClipPath(),
        transition: `clip-path ${duration}s ease-out`,
        willChange: 'clip-path'
      }}
    >
      {children}
    </div>
  );
}

// 粒子效果
export function ParticleEffect({ 
  count = 50, 
  color = '#3b82f6',
  size = 2,
  className = '' 
}: {
  count?: number;
  color?: string;
  size?: number;
  className?: string;
}) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [count]);

  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            willChange: 'transform'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

// 渐变文字动画
export function GradientText({ 
  children, 
  gradient = 'from-blue-400 to-purple-600',
  animate = true,
  className = '' 
}: {
  children: React.ReactNode;
  gradient?: string;
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${
        animate ? 'bg-size-200 animate-gradient-x' : ''
      } ${className}`}
    >
      {children}
      {animate && (
        <style jsx>{`
          .bg-size-200 {
            background-size: 200% 200%;
          }
          .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
          }
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}</style>
      )}
    </span>
  );
}