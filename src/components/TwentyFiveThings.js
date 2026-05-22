'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import annieTraitsData from './annieTraits.json';
import BoomerangVideoBg from './BoomerangVideoBg';

const TRAITS = annieTraitsData.traits;
const FULL_TITLE = '12 things I love about Annie';

export default function TwentyFiveThings() {
  const [phase, setPhase] = useState('idle');
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [titleFadingOut, setTitleFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const boxRefs = useRef([]);
  const cardRef = useRef(null);
  const cardTween = useRef(null);
  const triggeredRef = useRef(false);

  // Mobile detection — simple, no pagination calc
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // IntersectionObserver entrance trigger — starts typing animation
  useEffect(() => {
    if (triggeredRef.current || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggeredRef.current = true;
          observer.disconnect();
          startTyping();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const startTyping = () => {
    setPhase('typing');

    const obj = { count: 0 };
    const tl = gsap.timeline({
      onUpdate: () => {
        setDisplayedTitle(FULL_TITLE.slice(0, Math.floor(obj.count)));
      },
    });

    tl.to(obj, {
      count: FULL_TITLE.length,
      duration: FULL_TITLE.length * 0.08,
      ease: 'none',
    })
      .to(obj, { duration: 1.5 }) // hold
      .eventCallback('onComplete', () => {
        setTitleFadingOut(true);
        gsap.to(titleRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => setPhase('grid'),
        });
      });
  };

  const isTyping = displayedTitle.length < FULL_TITLE.length && phase === 'typing';
  const showTitle = phase === 'typing';

  // Card open
  const openCard = useCallback((index) => {
    if (activeCardIndex !== null) return;
    setActiveCardIndex(index);

    const box = boxRefs.current[index];
    if (!box) return;

    const boxRect = box.getBoundingClientRect();
    const sectionRect = sectionRef.current.getBoundingClientRect();

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Wait for the card DOM to render
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      const cardWidth = Math.min(window.innerWidth * 0.85, 480);
      const cardHeight = Math.min(window.innerHeight * 0.7, 480);

      // Set initial position immediately (section-relative)
      gsap.set(card, {
        top: boxRect.top - sectionRect.top,
        left: boxRect.left - sectionRect.left,
        width: boxRect.width,
        height: boxRect.height,
        x: 0,
        y: 0,
        borderRadius: 0,
      });

      // Animate to centered card within section
      cardTween.current = gsap.to(card, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: cardWidth,
        height: cardHeight,
        borderRadius: 16,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  }, [activeCardIndex]);

  // Card close
  const closeCard = useCallback(() => {
    if (activeCardIndex === null) return;

    const box = boxRefs.current[activeCardIndex];
    const card = cardRef.current;

    if (cardTween.current) cardTween.current.kill();

    if (!box || !card) {
      setActiveCardIndex(null);
      document.body.style.overflow = '';
      return;
    }

    const boxRect = box.getBoundingClientRect();
    const sectionRect = sectionRef.current.getBoundingClientRect();

    gsap.to(card, {
      top: boxRect.top - sectionRect.top,
      left: boxRect.left - sectionRect.left,
      width: boxRect.width,
      height: boxRect.height,
      x: 0,
      y: 0,
      borderRadius: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCardIndex(null);
        document.body.style.overflow = '';
      },
    });
  }, [activeCardIndex]);

  // Body scroll unlock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const columns = isMobile ? 3 : 4;
  const activeItem = activeCardIndex !== null ? TRAITS[activeCardIndex] : null;

  return (
    <section
      ref={sectionRef}
      id="twenty-five-things"
      className="relative snap-section w-full overflow-hidden"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {/* Boomerang video background */}
      <BoomerangVideoBg src="/flowersblooming.mp4" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 pointer-events-none" />

      {/* Typing title overlay */}
      {showTitle && (
        <div
          ref={titleRef}
          className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          <h2
            className="text-3xl sm:text-5xl md:text-6xl text-center px-6 max-w-3xl text-black"
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            {displayedTitle}
            {isTyping && (
              <span
                className="inline-block w-0.5 h-[0.8em] bg-black ml-1 align-middle"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </h2>
        </div>
      )}

      {/* Grid area — hidden during typing, shows during grid phase */}
      <div
        className="flex flex-col h-full w-full"
        style={{
          opacity: phase === 'grid' ? 1 : 0,
          pointerEvents: phase === 'grid' ? 'auto' : 'none',
        }}
      >
        {/* Grid */}
        <div
          ref={gridRef}
          className="flex-1 flex items-center justify-center"
        >
          <div
            className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-2xl"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              width: isMobile ? '100%' : 'min(65vh, 600px)',
              maxWidth: '100%',
              gap: '1px',
            }}
          >
            {TRAITS.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => { boxRefs.current[i] = el; }}
                className="flex items-center justify-center cursor-pointer select-none aspect-square bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-all duration-300"
                onClick={() => openCard(i)}
              >
                <span className="text-lg sm:text-2xl font-medium text-white/80">
                  {item.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card overlay */}
      {activeCardIndex !== null && activeItem && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40 bg-black/30"
            onClick={closeCard}
          />

          {/* Card */}
          <div
            ref={cardRef}
            className="absolute z-50 flex flex-col items-center justify-center shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={closeCard}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 cursor-pointer z-20"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={activeItem.image}
                alt={activeItem.trait}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            </div>

            {/* Text content */}
            <div className="relative z-10 flex flex-col justify-end w-full h-full p-6 sm:p-8">
              <span className="text-white/60 text-sm mb-2 tracking-widest uppercase">
                {String(activeItem.id).padStart(2, '0')}
              </span>
              <h3
                className="text-white text-xl sm:text-2xl md:text-3xl mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {activeItem.trait}
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg">
                {activeItem.description}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}