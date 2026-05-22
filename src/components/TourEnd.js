'use client';

import { RotateCcw } from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';

const NAV_LINKS = [
  { label: 'Hero', href: '#hero' },
  { label: 'Who is Annie', href: '#who-is-annie' },
  { label: '12 Things', href: '#twenty-five-things' },
  { label: 'Moments & Phrases', href: '#moments-and-phrases' },
  { label: 'Did You Know', href: '#did-you-know-quiz' },
];

export default function TourEnd() {
  const handleReplay = () => {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNav = (href) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="tour-end"
      className="relative w-full min-h-screen sm:h-screen snap-section overflow-hidden bg-[#1f2a1d]"
    >
      {/* Boomerang video background */}
      <BoomerangVideoBg src="/closing.mp4" className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32">
        <h1
          className="font-normal leading-[0.95] text-[#336443] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
          style={{
            fontFamily: '"Neue Haas Grotesk Display Pro 55 Roman", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
            letterSpacing: '-0.035em',
          }}
        >
          Annie Gamadi{' '}
          <span className="text-[#85AB8B]">
            Adwoa Mansa
            <br className="hidden sm:block" /> — Adwobi III
          </span>
        </h1>

        <p
          className="mt-6 sm:mt-8 text-[#4b5b47] text-sm sm:text-base md:text-lg leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Happy Birthday
        </p>

        {/* Old "End of Tour" text — preserved, subtle */}
        <p
          className="mt-8 text-white/30 text-xs tracking-[0.15em] uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          End of Annie Interactive Birthday Special Tour
        </p>
      </div>

      {/* Bottom-left: Replay button */}
      <div className="absolute z-20 bottom-6 left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0">
        <button
          onClick={handleReplay}
          className="flex items-center gap-2 bg-[#3d5638] text-white rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium hover:bg-[#2d4228] transition-colors duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <RotateCcw size={16} strokeWidth={2} />
          Replay
        </button>
      </div>

      {/* Bottom-right: Nav pills — desktop only */}
      <div className="absolute z-20 bottom-6 right-6 hidden sm:block">
        <div
          className="flex items-center gap-1 bg-white/70 backdrop-blur-md rounded-full pl-4 pr-1 py-1 shadow-sm border border-white/60"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="px-3 py-1.5 text-xs text-[#1f2a1d] hover:text-[#85AB8B] transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}