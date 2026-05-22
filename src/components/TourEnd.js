'use client';

export default function TourEnd() {
  return (
    <section
      id="tour-end"
      className="relative snap-section w-full bg-[#2C2420] flex items-center justify-center"
    >
      <div className="text-center px-6 max-w-2xl">
        <p
          className="text-white/60 text-sm tracking-widest uppercase mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          End of Tour
        </p>
        <h2
          className="text-3xl sm:text-5xl text-white"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          End of Annie Interactive Birthday Special Tour
        </h2>
      </div>
    </section>
  );
}