import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface Icon3DProps {
  type: 'search' | 'chef' | 'ai' | 'close' | 'recipe' | 'moon' | 'sun';
  className?: string;
}

const Icon3D: React.FC<Icon3DProps> = ({ type, className = 'w-6 h-6' }) => {
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    gsap.to(iconRef.current, {
      scale: 1.1,
      y: -2,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(iconRef.current, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const icons = {
    search: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    close: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    chef: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    ai: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    recipe: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    moon: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    sun: (
      <svg ref={iconRef} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return icons[type] || icons.recipe;
};

export default Icon3D;
