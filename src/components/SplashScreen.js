'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import usePreloader from '@/hooks/usePreloader';

const LOADING_MESSAGES = [
  'Gathering scattered leaves…',
  'Arranging the memories…',
  'Counting every reason…',
  'Warming the music…',
  'Wrapping it with care…',
  'Almost there…',
];

const MSG_INTERVAL_MS = 2800;

export default function SplashScreen() {
  const { progress, loaded } = usePreloader();
  const [phase, setPhase] = useState('loading');
  const [showCta, setShowCta] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const router = useRouter();
  const msgRef = useRef(0);
  const timeoutRef = useRef(null);

  // Cycle loading messages
  useEffect(() => {
    if (phase !== 'loading' || loaded) return;
    const interval = setInterval(() => {
      msgRef.current = (msgRef.current + 1) % LOADING_MESSAGES.length;
      setMsgIndex(msgRef.current);
    }, MSG_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [phase, loaded]);

  // Transition choreography: loading complete → CTA appears
  useEffect(() => {
    if (!loaded || phase !== 'loading') return;

    const t1 = setTimeout(() => setShowCta(true), 600);
    const t2 = setTimeout(() => {
      setPhase('image');
      setShowCta(false);
    }, 1200);

    timeoutRef.current = [t1, t2];
    return () => {
      timeoutRef.current?.forEach(clearTimeout);
    };
  }, [loaded, phase]);

  const startExperience = () => {
    setPhase('video');
  };

  const bgImages = (
    <>
      <img
        src="/leaves.jpg"
        alt=""
        className="block md:hidden absolute inset-0 w-full h-full object-cover"
      />
      <img
        src="/leaves_largescreen.png"
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
      />
    </>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* ── Loading phase ── */}
      {phase === 'loading' && (
        <>
          {bgImages}
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {/* Loading UI container — fades out when CTA appears */}
            <div
              className={`flex flex-col items-center gap-6 transition-all duration-500 ${
                showCta
                  ? 'opacity-0 translate-y-4 pointer-events-none'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Cinematic progress bar */}
              <div className="w-48 sm:w-64 h-0.5 bg-white/15 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      'linear-gradient(90deg, #F4845F, #E882B4, #F4845F)',
                    backgroundSize: '200% 100%',
                    animation: 'progress-shimmer 2s linear infinite',
                    boxShadow:
                      '0 0 8px rgba(232, 130, 180, 0.5), 0 0 20px rgba(232, 130, 180, 0.2)',
                    transition: 'width 300ms ease-out',
                  }}
                />
              </div>

              {/* Cycling loading message */}
              <p
                key={msgIndex}
                className="text-white/50 text-sm text-center tracking-wider font-light animate-fade-rise"
              >
                {LOADING_MESSAGES[msgIndex]}
              </p>
            </div>

            {/* CTA button — fades in after loading completes */}
            <div
              className={`transition-all duration-500 ${
                showCta
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <button
                onClick={startExperience}
                className="group relative px-10 py-5 rounded-full border border-white/60 text-white text-lg tracking-wide transition-all duration-500 hover:bg-white/10 hover:border-white/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Today is a special day, click to find out what it is
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Image / CTA phase (from original, kept for transition compatibility) ── */}
      {phase === 'image' && (
        <>
          {bgImages}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <button
              onClick={startExperience}
              className="group relative px-10 py-5 rounded-full border border-white/60 text-white text-lg tracking-wide transition-all duration-500 hover:bg-white/10 hover:border-white/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Today is a special day, click to find out what it is
            </button>
          </div>
        </>
      )}

      {/* ── Video phase ── */}
      {phase === 'video' && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={() => router.push('/home')}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/leavesVideo.mp4" media="(max-width: 767px)" />
          <source src="/leavesVideoLarge.mp4" media="(min-width: 768px)" />
        </video>
      )}
    </div>
  );
}