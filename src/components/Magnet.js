'use client';

import { useEffect, useRef } from 'react';

export default function Magnet({ children, strength = 20, padding = 50 }) {
  const ref = useRef(null);
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = 'ontouchstart' in window;
    if (isTouch.current) return;

    const el = ref.current;
    if (!el) return;

    el.style.willChange = 'transform';

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const distLeft = e.clientX - rect.left;
      const distRight = rect.right - e.clientX;
      const distTop = e.clientY - rect.top;
      const distBottom = rect.bottom - e.clientY;

      const nearEdge =
        distLeft < padding ||
        distRight < padding ||
        distTop < padding ||
        distBottom < padding;

      if (nearEdge) {
        el.style.transition = 'transform 0.3s ease-out';
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      } else {
        el.style.transition = 'transform 0.6s ease-in-out';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const handleMouseLeave = () => {
      el.style.transition = 'transform 0.6s ease-in-out';
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, padding]);

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}