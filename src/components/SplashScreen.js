'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const [phase, setPhase] = useState('image');
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Image phase */}
      {phase === 'image' && (
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
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <button
              onClick={() => setPhase('video')}
              className="group relative px-10 py-5 rounded-full border border-white/60 text-white text-lg tracking-wide transition-all duration-500 hover:bg-white/10 hover:border-white/90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Today is a special day, click to find out what it is
            </button>
          </div>
        </>
      )}

      {/* Video phase */}
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