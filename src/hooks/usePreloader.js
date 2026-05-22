'use client';

import { useState, useEffect, useRef } from 'react';

const IMAGE_ASSETS = [
  '/annie1.png',
  '/annie2.png',
  '/annie3.png',
  '/annie4.png',
  '/annie5.png',
  '/annie6.png',
  '/annie7.png',
  '/annie8.png',
  '/annie9.png',
  '/annie10.png',
  '/annie11.png',
  '/annie12.png',
  '/annietoon11.png',
  '/annietoon22.png',
  '/annietoon33.png',
  '/annietoon44.png',
  '/bird.jpg',
  '/envelope.png',
  '/envelope_open.png',
  '/extrasheet.png',
  '/here.png',
  '/impudence.png',
  '/leaves.jpg',
  '/leaves_largescreen.png',
  '/letter.png',
  '/nature1.jpg',
];

const VIDEO_ASSETS = [
  '/closing.mp4',
  '/flowersblooming.mp4',
  '/hero.mp4',
  '/leavesVideo.mp4',
  '/leavesVideoLarge.mp4',
];

const ASSETS = [...IMAGE_ASSETS, ...VIDEO_ASSETS];
const TOTAL = ASSETS.length;
const SAFETY_TIMEOUT_MS = 15000;

function isVideo(url) {
  return url.endsWith('.mp4');
}

export default function usePreloader() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const failedRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let completed = 0;

    const markLoaded = (url, ok) => {
      if (!mountedRef.current) return;
      if (!ok) failedRef.current.push(url);
      completed++;
      setProgress(Math.min(Math.round((completed / TOTAL) * 100), 100));
      if (completed >= TOTAL) {
        setLoaded(true);
      }
    };

    // Preload images
    IMAGE_ASSETS.forEach((url) => {
      const img = new Image();
      img.onload = () => markLoaded(url, true);
      img.onerror = () => markLoaded(url, false);
      img.src = url;
    });

    // Preload videos via <link rel="preload">
    VIDEO_ASSETS.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = url;
      link.onload = () => markLoaded(url, true);
      link.onerror = () => markLoaded(url, false);
      document.head.appendChild(link);
    });

    // Safety timeout — force-complete if anything hangs
    const safetyTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setProgress(100);
      setLoaded(true);
    }, SAFETY_TIMEOUT_MS);

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  return { progress, loaded, failedAssets: failedRef.current };
}