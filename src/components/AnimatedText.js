'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedText({ children, className = '' }) {
  const [revealIndex, setRevealIndex] = useState(0);
  const ref = useRef(null);
  const chars = (children || '').split('');

  useEffect(() => {
    const el = ref.current;
    if (!el || chars.length === 0) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        const idx = Math.floor(self.progress * chars.length);
        setRevealIndex(Math.min(idx, chars.length));
      },
    });

    return () => st.kill();
  }, [children]);

  if (chars.length === 0) return null;

  return (
    <p ref={ref} className={`relative ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className="relative inline-block">
          {/* Invisible placeholder to hold layout */}
          <span className="invisible">{char === ' ' ? ' ' : char}</span>
          {/* Animated reveal */}
          <span
            className="absolute inset-0"
            style={{
              opacity: i <= revealIndex ? 1 : 0.2,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </p>
  );
}