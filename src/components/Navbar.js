'use client';

import { useState } from 'react';

const links = [
  { label: 'things Annie would say', href: '#things-annie-would-say' },
  { label: '50 things I love about Annie', href: '#fifty-things' },
  { label: "Moments I'll never forget", href: '#moments' },
  { label: 'Did you know', href: '#did-you-know' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-10 w-full px-6 py-6" style={{ fontFamily: 'var(--font-inter)' }}>
      <div className="mx-auto flex items-center justify-end">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#6F6F6F] hover:text-black transition-colors duration-300"
            >
              {link.label}
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
              className="text-sm text-[#6F6F6F] hover:text-black transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}