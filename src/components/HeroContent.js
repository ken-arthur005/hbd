'use client';

import { useState } from 'react';

export default function HeroContent() {
  const [transitioning, setTransitioning] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setTransitioning(true);
    setTimeout(() => {
      document.getElementById('who-is-annie')?.scrollIntoView({ behavior: 'smooth' });
    }, 650);
  };

  return (
    <div
      className={`transition-opacity duration-500 ${
        transitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDelay: transitioning ? '0ms' : '0ms' }}
    >
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal text-black"
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            lineHeight: 0.95,
            letterSpacing: '-2.46px',
          }}
        >
          WORLD<br className="sm:hidden" /> ANNIE DAY
        </h1>

        <p
          className="animate-fade-rise-delay text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F]"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          On May 22, about 3000 years ago, a star was born in the vast universe.
          This star, named Annie, shone brightly for centuries, illuminating the
          darkness with her radiant light.
        </p>

        <a
          href="#who-is-annie"
          onClick={handleClick}
          className="animate-fade-rise-delay-2 inline-block rounded-full bg-black px-14 py-5 text-base text-white mt-12 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Begin Journey
        </a>
      </div>
    </div>
  );
}