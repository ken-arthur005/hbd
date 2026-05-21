'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 0.5;

    const updateOpacity = () => {
      if (!mountedRef.current) return;

      const t = video.currentTime;
      const d = video.duration;

      if (Number.isNaN(d) || d <= 0) {
        rafRef.current = requestAnimationFrame(updateOpacity);
        return;
      }

      let opacity;
      if (t < fadeDuration) {
        opacity = t / fadeDuration;
      } else if (t > d - fadeDuration) {
        opacity = (d - t) / fadeDuration;
      } else {
        opacity = 1;
      }

      video.style.opacity = Math.max(0, Math.min(1, opacity));
      rafRef.current = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = 0;
      setTimeout(() => {
        if (!mountedRef.current) return;
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    rafRef.current = requestAnimationFrame(updateOpacity);

    return () => {
      mountedRef.current = false;
      video.removeEventListener('ended', handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute z-0 overflow-hidden" style={{ top: 300, right: 0, bottom: 0, left: 0 }}>
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />
      {/* Gradient overlay to blend video into white background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
    </div>
  );
}