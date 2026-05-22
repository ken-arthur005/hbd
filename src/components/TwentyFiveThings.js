'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const FULL_TITLE = '25 things I love about Annie';

const PLACEHOLDER_ITEMS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  label: `Thing #${i + 1}`,
  text: `This is placeholder thing #${i + 1} about Annie — actual content coming soon.`,
}));

export default function TwentyFiveThings() {
  const [phase, setPhase] = useState('idle');
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [titleFadingOut, setTitleFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const boxRefs = useRef([]);
  const cardRef = useRef(null);
  const cardTween = useRef(null);
  const triggeredRef = useRef(false);

  // Mobile detection + dynamic itemsPerPage
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        const cellSize = window.innerWidth / 4;
        const rowsThatFit = Math.max(2, Math.floor((window.innerHeight * 0.85) / cellSize));
        setItemsPerPage(Math.min(rowsThatFit * 4, 25));
      } else {
        setItemsPerPage(10);
      }
    };
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

    // We need to wait for the card DOM to render. Use rAF.
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

  // Clamp currentPage when itemsPerPage shrinks (e.g. on resize)
  useEffect(() => {
    const newTotalPages = Math.ceil(PLACEHOLDER_ITEMS.length / itemsPerPage);
    if (currentPage >= newTotalPages) {
      setCurrentPage(0);
    }
  }, [itemsPerPage]);

  const columns = isMobile ? 4 : 5;
  const totalPages = Math.ceil(PLACEHOLDER_ITEMS.length / itemsPerPage);
  const paginatedItems = PLACEHOLDER_ITEMS.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const itemsToRender = isMobile ? paginatedItems : PLACEHOLDER_ITEMS;

  const goToPage = (page) => {
    if (activeCardIndex !== null) closeCard();
    setCurrentPage(page);
  };
  const activeItem = activeCardIndex !== null ? PLACEHOLDER_ITEMS[activeCardIndex] : null;

  return (
    <section
      ref={sectionRef}
      id="twenty-five-things"
      className="relative snap-section w-full bg-white"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {/* Typing title overlay */}
      {showTitle && (
        <div
          ref={titleRef}
          className="absolute inset-0 z-20 flex items-center justify-center bg-white"
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

      {/* Grid area + pagination — hidden during typing, shows during grid phase */}
      <div
        className="flex flex-col h-full w-full"
        style={{
          opacity: phase === 'grid' || phase === 'card-open' ? 1 : 0,
          pointerEvents: phase === 'grid' || phase === 'card-open' ? 'auto' : 'none',
        }}
      >
        {/* Grid */}
        <div
          ref={gridRef}
          className="flex-1 flex items-center justify-center"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              width: isMobile ? '100%' : 'min(100vh, 900px)',
              maxWidth: '100%',
            }}
          >
            {itemsToRender.map((item, i) => {
              const gridIndex = isMobile ? currentPage * itemsPerPage + i : i;
              return (
                <div
                  key={item.id}
                  ref={(el) => { boxRefs.current[gridIndex] = el; }}
                  className="flex items-center justify-center cursor-pointer select-none"
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'white',
                    border: '1px solid #bfdbfe',
                    transition: 'background-color 250ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                  onClick={() => openCard(gridIndex)}
                >
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination controls — mobile only */}
        {isMobile && totalPages > 1 && (
        <div className="flex-shrink-0 flex items-center justify-center gap-4 py-4 pb-6">
          <button
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || activeCardIndex !== null}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-blue-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <span className="text-sm text-gray-400 font-mono">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1 || activeCardIndex !== null}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-blue-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
        )}
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
            className="absolute z-50 flex flex-col items-center justify-center bg-white shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={closeCard}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors duration-200 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {/* Card content */}
            <div className="flex flex-col items-center justify-center text-center px-8 sm:px-16 max-w-2xl">
              <span className="text-sm text-blue-500 mb-4 tracking-widest uppercase">
                {activeItem.label}
              </span>
              <p
                className="text-xl sm:text-3xl md:text-4xl text-black leading-relaxed"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {activeItem.text}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}