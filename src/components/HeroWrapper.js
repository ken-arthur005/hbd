'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroWrapper({ children }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        const opacity = 1 - self.progress;
        hero.style.opacity = opacity;
        hero.style.pointerEvents = opacity < 0.05 ? 'none' : '';
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative snap-section w-full bg-white"
      style={{ willChange: 'opacity' }}
    >
      {children}
    </section>
  );
}