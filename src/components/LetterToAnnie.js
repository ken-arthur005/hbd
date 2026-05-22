'use client';

export default function LetterToAnnie() {
  return (
    <section
      id="letter-to-annie"
      className="relative snap-section w-full bg-[#FFF8F0] flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <img
          src="/envelope.png"
          alt="Letter to Annie"
          className="w-32 sm:w-48 md:w-64 h-auto object-contain"
        />
        <p
          className="text-lg sm:text-2xl text-[#5C4E3E] text-center px-6"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          A Letter for Annie
        </p>
      </div>
    </section>
  );
}