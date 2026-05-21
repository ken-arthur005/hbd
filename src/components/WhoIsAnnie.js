'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  { src: '/annietoon11.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: '/annietoon22.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: '/annietoon33.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: '/annietoon44.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

const SLIDE_CONTENT = [
  {
    title: 'Annie wants a car',
    description:
      'For some reason, this girl just can\'t seem to get enough of cars. "Annie what do you want?" she\'d tell you, car',
  },
  {
    title: 'Annie loves Nature',
    description:
      'Seriously, you should see her when she\'s around trees and tiny bugs',
  },
  {
    title: 'Supreme Intelligence',
    description:
      'She\'s a prodigy, iq unmatched, would give Einstein a run for his money',
  },
  {
    title: "She's Amazing",
    description: 'This one needs no explanation',
  },
];

export default function WhoIsAnnie() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // IntersectionObserver for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload images
  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  const navigate = useCallback(
    (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
      );
      setTimeout(() => setIsAnimating(false), 650);
    },
    [isAnimating]
  );

  const roles = {
    center: activeIndex,
    left: (activeIndex + 3) % 4,
    right: (activeIndex + 1) % 4,
    back: (activeIndex + 2) % 4,
  };

  const getRole = (index) => {
    if (index === roles.center) return 'center';
    if (index === roles.left) return 'left';
    if (index === roles.right) return 'right';
    return 'back';
  };

  const getRoleStyle = (role) => {
    const transition = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)';

    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
          transition,
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          transition,
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          transition,
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
          transition,
        };
      default:
        return {};
    }
  };

  const content = SLIDE_CONTENT[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="who-is-annie"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'var(--font-inter)',
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 50, opacity: 0.4, backgroundSize: '200px 200px' }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" opacity="0.08" />
          </svg>
        </div>

        {/* Giant ghost text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          WHO IS ANNIE
        </div>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((image, index) => {
            const role = getRole(index);
            const style = getRoleStyle(role);

            return (
              <div
                key={image.src}
                className="absolute"
                style={{
                  aspectRatio: '0.6 / 1',
                  willChange: 'transform, filter, opacity',
                  ...style,
                }}
              >
                <img
                  src={image.src}
                  alt=""
                  draggable={false}
                  className="w-full h-full"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{
            zIndex: 60,
            maxWidth: 320,
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1) 0.15s, transform 0.9s cubic-bezier(0.4,0,0.2,1) 0.15s',
          }}
        >
          <p
            className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase tracking-widest text-white"
            style={{ opacity: 0.95, letterSpacing: '0.02em' }}
          >
            {content.title}
          </p>
          <p className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5 leading-relaxed"
            style={{ opacity: 0.85, lineHeight: 1.6 }}
          >
            {content.description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-transparent border-2 border-white text-white transition-all duration-150 hover:scale-[1.08] cursor-pointer"
              style={{ transition: 'transform 150ms, background-color 150ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Previous"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-transparent border-2 border-white text-white transition-all duration-150 hover:scale-[1.08] cursor-pointer"
              style={{ transition: 'transform 150ms, background-color 150ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Next"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}