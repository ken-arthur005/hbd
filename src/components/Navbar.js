'use client';

import { useState, useEffect } from 'react';

const links = [
  { label: 'Moments and Phrases', href: '#moments-and-phrases' },
  { label: '12 things I love about Annie', href: '#twenty-five-things' },
  { label: 'Did you know', href: '#did-you-know-quiz' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection('#' + visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="relative z-10 w-full px-6 py-6" style={{ fontFamily: 'var(--font-inter)' }}>
      <div className="mx-auto flex items-center justify-end">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-[#6F6F6F] hover:text-black transition-colors duration-300"
            >
              {link.label}
              {activeSection === link.href && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black" />
              )}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-black transition-all duration-300 ${
              open ? 'translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-black transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-black transition-all duration-300 ${
              open ? '-translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-end gap-4 pt-4 pr-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="relative text-sm text-[#6F6F6F] hover:text-black transition-colors duration-300"
            >
              {link.label}
              {activeSection === link.href && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black" />
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}