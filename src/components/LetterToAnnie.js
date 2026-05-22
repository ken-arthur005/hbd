'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';

export default function LetterToAnnie() {
  const { letterOpen, closeLetter } = useQuiz();
  const [phase, setPhase] = useState('envelope'); // envelope | letter
  const [envelopeSrc, setEnvelopeSrc] = useState('/envelope.png');
  const [isAnimating, setIsAnimating] = useState(false);

  const overlayRef = useRef(null);
  const envelopeWrapRef = useRef(null);
  const letterWrapRef = useRef(null);

  // Initialize overlay when it opens
  useEffect(() => {
    if (!letterOpen) return;

    setPhase('envelope');
    setEnvelopeSrc('/envelope.png');
    setIsAnimating(false);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(letterWrapRef.current, { scale: 0, opacity: 0 });
      gsap.set(envelopeWrapRef.current, { scale: 1, opacity: 1 });

      // Fade in overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [letterOpen]);

  // Envelope click → GSAP animation sequence
  const handleEnvelopeClick = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('letter');
        setIsAnimating(false);
      },
    });

    // Step A: Quick scale pulse
    tl.to(envelopeWrapRef.current, {
      scale: 1.08,
      duration: 0.12,
      ease: 'power2.out',
    });
    tl.to(envelopeWrapRef.current, {
      scale: 1.0,
      duration: 0.12,
      ease: 'power2.in',
      onStart: () => setEnvelopeSrc('/envelope_open.png'),
    });

    // Step B: Pause showing open envelope
    tl.to({}, { duration: 0.35 });

    // Step C: Letter expands from center (starts near end of pause)
    tl.to(
      letterWrapRef.current,
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.2'
    );

    // Step D: Envelope fades out during letter expansion
    tl.to(
      envelopeWrapRef.current,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'power2.in',
      },
      '-=0.5'
    );
  }, [isAnimating]);

  // Close handler
  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        // Reset transforms for next open
        gsap.set(envelopeWrapRef.current, { opacity: 1, scale: 1 });
        gsap.set(letterWrapRef.current, { opacity: 0, scale: 0 });
        setPhase('envelope');
        setEnvelopeSrc('/envelope.png');
        setIsAnimating(false);
        closeLetter();
        document.getElementById('tour-end')?.scrollIntoView({ behavior: 'smooth' });
      },
    });
  }, [isAnimating, closeLetter]);

  if (!letterOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      {/* Envelope — centered, clickable */}
      <div
        ref={envelopeWrapRef}
        onClick={handleEnvelopeClick}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <img
          src={envelopeSrc}
          alt="Open letter to Annie"
          className="w-[100px] xs:w-[140px] sm:w-[200px] md:w-[260px] h-auto object-contain select-none
                     transition-shadow duration-300 hover:drop-shadow-xl active:scale-[0.97]"
          draggable={false}
        />
      </div>

      {/* Letter — hidden initially, expands on click */}
      <div
        ref={letterWrapRef}
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        <img
          src="/letter.png"
          alt="Dear Annie..."
          className="max-w-full max-h-full sm:max-w-[90%] sm:max-h-[90%] lg:max-w-[85%] lg:max-h-[85%]
                     object-contain rounded-lg shadow-2xl select-none"
          draggable={false}
        />
      </div>

      {/* Close button — only visible in letter phase */}
      {phase === 'letter' && (
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] w-10 h-10 sm:w-12 sm:h-12
                     rounded-full bg-black/40 hover:bg-black/60 text-white
                     flex items-center justify-center cursor-pointer
                     transition-colors duration-200 backdrop-blur-sm"
          aria-label="Close letter"
        >
          <X size={22} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}