'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import Magnet from '@/components/Magnet';

const CARDS = [
  {
    title: 'When she collected extra sheet during calculus',
    image: '/extrasheet.png',
    text: 'During a maths paper, poor Arthur was questioning his life choices, in the distance, that tiny devil was collecting extra sheets. it was at that point that he knew he was witnessing greatness beyond his comprehension',
  },
  {
    title: 'She showed up',
    image: '/here.png',
    text: 'There was disaster in heartland, and like a superman, she appeared to save the day. Heart land still owes her a lot',
  },
  {
    title: 'Impudence of twerking maggotas',
    image: '/impudence.png',
    text: "I will never understand where she gets that phrase from, or what the fuck it even means",
  },
];

const totalCards = CARDS.length;

// Y-offset and scale for each position in the stack
// position 0 = top (active), 1 = middle, 2 = bottom (furthest back)
const STACK_POSITIONS = [
  { y: 0, scale: 1, z: 30 },
  { y: 24, scale: 0.94, z: 20 },
  { y: 48, scale: 0.88, z: 10 },
];

const FULL_TITLE = 'Top Annie Moments and Phrases I will never forget';

export default function MomentsAndPhrases() {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const deckRef = useRef(null);
  const typingTriggered = useRef(false);
  const titleRef = useRef(null);

  // Compute card order from activeIndex
  // activeIndex=0 → order [0,1,2], activeIndex=1 → [1,2,0], etc.
  const order = [
    activeIndex,
    (activeIndex + 1) % totalCards,
    (activeIndex + 2) % totalCards,
  ];

  // Typing animation — triggered once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typingTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typingTriggered.current) return;
        typingTriggered.current = true;
        observer.disconnect();

        const obj = { count: 0 };
        gsap.to(obj, {
          count: FULL_TITLE.length,
          duration: FULL_TITLE.length * 0.08,
          ease: 'none',
          onUpdate: () => {
            setDisplayedTitle(FULL_TITLE.slice(0, Math.floor(obj.count)));
          },
          onComplete: () => setTypingDone(true),
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initial GSAP set — position cards at their stack positions
  useEffect(() => {
    const ctx = gsap.context(() => {
      order.forEach((cardIdx, pos) => {
        const p = STACK_POSITIONS[pos];
        gsap.set(cardsRef.current[cardIdx], {
          y: p.y,
          scale: p.scale,
          zIndex: p.z,
        });
      });
      // Reveal deck immediately after positioning
      if (deckRef.current) {
        gsap.set(deckRef.current, { opacity: 1 });
      }
    });
    return () => ctx.revert();
  }, []);

  // Navigate to next card
  const goNext = useCallback(() => {
    if (isAnimating || activeIndex >= totalCards - 1) return;
    setIsAnimating(true);

    const newActive = activeIndex + 1;
    const newOrder = [
      newActive,
      (newActive + 1) % totalCards,
      (newActive + 2) % totalCards,
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(newActive);
        setIsAnimating(false);
      },
    });

    newOrder.forEach((cardIdx, pos) => {
      const p = STACK_POSITIONS[pos];
      tl.to(
        cardsRef.current[cardIdx],
        { y: p.y, scale: p.scale, zIndex: p.z, duration: 0.5, ease: 'power2.inOut' },
        0
      );
    });
  }, [activeIndex, isAnimating]);

  // Navigate to previous card
  const goPrev = useCallback(() => {
    if (isAnimating || activeIndex <= 0) return;
    setIsAnimating(true);

    const newActive = activeIndex - 1;
    const newOrder = [
      newActive,
      (newActive + 1) % totalCards,
      (newActive + 2) % totalCards,
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(newActive);
        setIsAnimating(false);
      },
    });

    newOrder.forEach((cardIdx, pos) => {
      const p = STACK_POSITIONS[pos];
      tl.to(
        cardsRef.current[cardIdx],
        { y: p.y, scale: p.scale, zIndex: p.z, duration: 0.5, ease: 'power2.inOut' },
        0
      );
    });
  }, [activeIndex, isAnimating]);

  const isTyping = !typingDone && displayedTitle.length < FULL_TITLE.length;

  return (
    <section
      ref={sectionRef}
      id="moments-and-phrases"
      className="relative w-full -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] z-10 pb-20 sm:pb-24"
      style={{
        backgroundImage: 'url(/nature1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none z-[1]" />

      {/* Content (above overlay) */}
      <div className="relative z-10">
        {/* Heading with typing animation */}
        <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 px-4">
          <Magnet strength={30} padding={40}>
            <h2
              ref={titleRef}
              className="text-3xl sm:text-5xl md:text-6xl text-center text-white px-4 min-h-[1.5em]"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {displayedTitle}
              {isTyping && (
                <span
                  className="inline-block w-0.5 h-[0.8em] bg-white ml-1 align-middle"
                  style={{ animation: 'blink 1s step-end infinite' }}
                />
              )}
            </h2>
          </Magnet>
        </div>

        {/* Card deck */}
        <div
          ref={deckRef}
          className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8"
          style={{ height: '55vh', minHeight: '360px', opacity: 0 }}
        >
          {CARDS.map((card, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute inset-0 w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#E8DCC8] bg-[#FFF8F0] overflow-hidden p-4 sm:p-6 md:p-8"
            >
              <div className="w-full h-full flex flex-col sm:flex-row">
                {/* Image column */}
                <div className="w-full sm:w-1/2 h-1/2 sm:h-full mb-4 sm:mb-0 sm:pr-4">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                  />
                </div>

                {/* Text column */}
                <div className="w-full sm:w-1/2 h-1/2 sm:h-full flex flex-col justify-center sm:pl-4 px-2 sm:px-4">
                  <h3
                    className="text-base sm:text-xl md:text-2xl text-[#2C2420] mb-2 sm:mb-4 md:mb-6 font-semibold"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-xs sm:text-base md:text-lg leading-relaxed text-[#5C4E3E]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {card.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons + dots */}
        <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
          <Magnet strength={25} padding={30}>
            <button
              onClick={goPrev}
              disabled={activeIndex === 0 || isAnimating}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-white/70 text-white/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          </Magnet>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 sm:gap-3 px-3">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (isAnimating || i === activeIndex) return;
                  if (i > activeIndex) {
                    // Need to advance multiple times — go one step
                    goNext();
                  } else {
                    goPrev();
                  }
                }}
                className="transition-all duration-300 cursor-pointer"
                aria-label={`Go to card ${i + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-3 h-3 sm:w-4 sm:h-4 bg-white'
                      : 'w-2 h-2 sm:w-3 sm:h-3 bg-white/40 hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>

          <Magnet strength={25} padding={30}>
            <button
              onClick={goNext}
              disabled={activeIndex === totalCards - 1 || isAnimating}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-white/70 text-white/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </Magnet>
        </div>
      </div>
    </section>
  );
}