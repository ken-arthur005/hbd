'use client';

import { useEffect, useRef } from 'react';

export default function HeroWrapper({ children }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let raf;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const fadeStart = heroHeight * 0.3;
        const fadeEnd = heroHeight * 0.9;

        let opacity;
        if (scrollY <= fadeStart) {
          opacity = 1;
        } else if (scrollY >= fadeEnd) {
          opacity = 0;
        } else {
          opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        }

        hero.style.opacity = opacity;
        hero.style.pointerEvents = opacity < 0.05 ? 'none' : '';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full bg-white"
      style={{ willChange: 'opacity' }}
    >
      {children}
    </section>
  );
}