'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useQuiz } from '@/context/QuizContext';

const FULL_TITLE = 'Annie Birthday Special Interactive Quiz';
const CAPTION = 'answer all questions correctly for a surprise';

const QUESTIONS = [
  {
    question: "Pick Annie's favourite",
    options: ['Coffee', 'Milo', 'Milk'],
    correctAnswer: 0,
  },
  {
    question: 'Where are you most likely to find Annie',
    options: ['In a mall', 'In her room', 'Sitting among trees'],
    correctAnswer: 2,
  },
  {
    question: "What does Annie do when she's sad",
    options: ['Cry', 'Be quiet', 'Talk too much'],
    correctAnswer: 2,
  },
  {
    question: 'Annie keeps a collection of',
    options: ['Leaves', 'Keys', 'Books'],
    correctAnswer: 0,
  },
  {
    question: 'What does Annie want',
    options: ['Clothes', 'Food', 'A car'],
    correctAnswer: 2,
  },
  {
    question: "Which of these is Annie likely to say",
    options: ['"I\'m hungry"', '"You fish"', '"I\'m tired"'],
    correctAnswer: 1,
  },
  {
    question: "If Annie had superpowers, she'd most have",
    options: ['Psychic abilities', 'Super strength', 'Teleportation'],
    correctAnswer: 0,
  },
  {
    question: 'Annie would rather',
    options: ['Watch a movie', 'Dance', 'Read a book'],
    correctAnswer: 2,
  },
  {
    question: 'Which of these names is Annie associated with',
    options: ['Abena the third', 'Adwoa Mansa', 'Maame Esi'],
    correctAnswer: 1,
  },
  {
    question: "What is Annie's Birthday",
    options: ['May 13', 'May 22', 'January 9'],
    correctAnswer: 1,
  },
];

export default function DidYouKnowQuiz() {
  const [phase, setPhase] = useState('idle'); // idle | playing | modal | complete
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answersCorrect, setAnswersCorrect] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); // null | 'correct' | 'wrong'
  const [selectedAnswer, setSelectedAnswer] = useState(null); // index of clicked answer

  const { quizCompleted, initialized, completeQuiz, resetQuiz, openLetter } = useQuiz();

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const typingTriggered = useRef(false);
  const modalRef = useRef(null);
  const progressRef = useRef(null);
  const contentRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Preload letter assets when quiz starts playing
  useEffect(() => {
    if (phase !== 'playing') return;
    const img1 = new Image();
    img1.src = '/letter.png';
    const img2 = new Image();
    img2.src = '/envelope_open.png';
  }, [phase]);

  // Typing animation — triggered once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typingTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typingTriggered.current) return;
        typingTriggered.current = true;
        observer.disconnect();

        const obj = { count: 0 };
        gsap.to(obj, {
          count: FULL_TITLE.length,
          duration: FULL_TITLE.length * 0.08,
          ease: 'none',
          onUpdate: () => {
            setDisplayedTitle(FULL_TITLE.slice(0, Math.floor(obj.count)));
          },
          onComplete: () => setTypingDone(true),
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Opacity restoration — fires every time the section re-enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (quizCompleted) {
          gsap.set(sectionRef.current, { opacity: 1 });
          setPhase('idle');
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [quizCompleted]);

  // Animate progress bar width when answersCorrect changes
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${answersCorrect * 10}%`,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [answersCorrect]);

  // Handle answer selection
  const handleAnswer = useCallback(
    (selectedIndex) => {
      if (isAnimating || feedbackState !== null) return;

      setSelectedAnswer(selectedIndex);
      const isCorrect = selectedIndex === QUESTIONS[currentQuestion].correctAnswer;

      if (isCorrect) {
        setFeedbackState('correct');
        setIsAnimating(true);

        gsap.delayedCall(0.4, () => {
          setFeedbackState(null);
          setSelectedAnswer(null);
          setIsAnimating(false);
          const newCorrect = answersCorrect + 1;
          setAnswersCorrect(newCorrect);

          if (newCorrect === 10) {
            setPhase('complete');
          } else {
            setCurrentQuestion((prev) => prev + 1);
          }
        });
      } else {
        setFeedbackState('wrong');
        setIsAnimating(true);

        gsap.delayedCall(0.4, () => {
          setFeedbackState(null);
          setSelectedAnswer(null);
          setIsAnimating(false);
          setPhase('modal');

          // Animate modal entrance
          if (modalRef.current) {
            gsap.fromTo(
              modalRef.current,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
            );
          }
        });
      }
    },
    [currentQuestion, answersCorrect, isAnimating, feedbackState]
  );

  // Handle retry — restart quiz from Q1
  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setAnswersCorrect(0);
    setPhase('playing');
    setFeedbackState(null);
    setSelectedAnswer(null);
    setIsAnimating(false);
  }, []);

  // Handle exit — scroll to tour end
  const handleExit = useCallback(() => {
    document.getElementById('tour-end')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle retake from completed summary card
  const handleQuizReset = useCallback(() => {
    resetQuiz();
    setCurrentQuestion(0);
    setAnswersCorrect(0);
    setPhase('idle');
    setFeedbackState(null);
    setSelectedAnswer(null);
    setIsAnimating(false);
    setDisplayedTitle('');
    typingTriggered.current = false;
    // Reset opacity in case it was faded out
    if (sectionRef.current) {
      gsap.set(sectionRef.current, { opacity: 1 });
    }
  }, [resetQuiz]);

  // Handle all-correct completion — save to localStorage and open letter
  useEffect(() => {
    if (phase !== 'complete' || !sectionRef.current) return;

    gsap.delayedCall(1.5, () => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Save completion to localStorage
          completeQuiz();
          // Open letter overlay after brief delay
          gsap.delayedCall(0.3, () => {
            openLetter();
          });
        },
      });
    });
  }, [phase, completeQuiz, openLetter]);

  const isTyping = !typingDone && displayedTitle.length < FULL_TITLE.length;
  const question = QUESTIONS[currentQuestion];
  const progressPercent = answersCorrect * 10;

  const getOptionClass = (idx) => {
    const base = 'w-full text-left px-5 py-4 rounded-xl text-base sm:text-lg border-2 transition-all duration-200 cursor-pointer';

    if (feedbackState === 'correct') {
      if (idx === question.correctAnswer) {
        return `${base} bg-green-100 border-green-500 text-green-800`;
      }
      return `${base} bg-white border-[#E8DCC8] text-[#2C2420]`;
    }

    if (feedbackState === 'wrong') {
      if (idx === question.correctAnswer) {
        return `${base} bg-green-100 border-green-500 text-green-800`;
      }
      if (idx === selectedAnswer) {
        return `${base} bg-red-100 border-red-400 text-red-700`;
      }
      return `${base} bg-white border-[#E8DCC8] text-[#2C2420]`;
    }

    return `${base} bg-white border-[#E8DCC8] text-[#2C2420] hover:border-[#C8BBA8] hover:bg-[#FAF6F0]`;
  };

  return (
    <section
      ref={sectionRef}
      id="did-you-know-quiz"
      className="relative snap-section w-full"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {/* Mobile background — visible on <640px */}
      <div
        className="block sm:hidden absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/bird.jpg)" }}
      />
      <div className="block sm:hidden absolute inset-0 bg-black/30" />

      {/* Main flex container */}
      <div className="relative z-10 flex w-full h-full">
        {/* ========== LEFT COLUMN — 30% (desktop only) ========== */}
        <div
          className="hidden sm:flex w-[30%] relative flex-col items-center justify-center bg-cover bg-center px-6"
          style={{ backgroundImage: "url(/bird.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 text-center">
            <h2
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl text-white leading-tight"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {displayedTitle}
              {isTyping && (
                <span
                  className="inline-block w-0.5 h-[0.8em] bg-white ml-1 align-middle"
                  style={{ animation: 'blink 1s step-end infinite' }}
                />
              )}
            </h2>

            {typingDone && (
              <p
                className="text-white/70 text-sm md:text-base mt-4 tracking-wider"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {CAPTION}
              </p>
            )}
          </div>
        </div>

        {/* ========== RIGHT COLUMN — 70% (full on mobile) ========== */}
        <div
          className="w-full sm:w-[70%] flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            backgroundColor: isMobile ? 'rgba(255,248,240,0.92)' : '#FFF8F0',
          }}
        >
          {/* Ghost background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="text-[clamp(60px,15vw,160px)] font-black text-[#F0E8D8] uppercase leading-none"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              QUIZ
            </span>
          </div>

          {/* ===== COMPLETED SUMMARY — shown when returning after completion ===== */}
          {quizCompleted && initialized && (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
              <h3
                className="text-2xl sm:text-3xl md:text-4xl text-[#2C2420] text-center mb-8"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                You know Annie well{' '}
                <span className="inline-block">:)</span>
              </h3>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={openLetter}
                  className="w-full py-3.5 rounded-full bg-black text-white text-base font-medium tracking-wide hover:bg-black/80 transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  View the Letter
                </button>
                <button
                  onClick={handleQuizReset}
                  className="w-full py-3.5 rounded-full border-2 border-[#E8DCC8] text-[#5C4E3E] text-base font-medium tracking-wide hover:bg-[#FAF6F0] transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}

          {/* ===== WELCOME STATE ===== */}
          {!quizCompleted && phase === 'idle' && (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 sm:px-10">
              {/* Mobile-only header + caption */}
              {isMobile && (
                <div className="text-center mb-8">
                  <h2
                    className="text-2xl text-white leading-tight"
                    style={{
                      fontFamily: 'var(--font-instrument-serif)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    {typingDone ? FULL_TITLE : displayedTitle}
                    {isTyping && (
                      <span
                        className="inline-block w-0.5 h-[0.8em] bg-white ml-1 align-middle"
                        style={{ animation: 'blink 1s step-end infinite' }}
                      />
                    )}
                  </h2>
                  {typingDone && (
                    <p className="text-white/70 text-sm mt-3 tracking-wider">
                      {CAPTION}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setPhase('playing')}
                className="rounded-full bg-black text-white px-12 py-4 text-lg font-medium tracking-wide hover:bg-black/80 transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Start Quiz
              </button>
            </div>
          )}

          {/* ===== PLAYING STATE ===== */}
          {!quizCompleted && phase === 'playing' && (
            <div
              ref={contentRef}
              className="relative z-10 flex flex-col w-full h-full px-6 sm:px-10 py-8 sm:py-12"
            >
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#E8DCC8] rounded-full overflow-hidden mb-6">
                <div
                  ref={progressRef}
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(to right, #F4845F, #E882B4)',
                  }}
                />
              </div>

              {/* Question counter */}
              <p className="text-[#9C8C7A] text-sm tracking-wider mb-3">
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </p>

              {/* Question text */}
              <h3
                className="text-xl sm:text-2xl md:text-3xl text-[#2C2420] mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {question.question}
              </h3>

              {/* Answer options */}
              <div className="flex flex-col gap-3 w-full max-w-md">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnimating}
                    className={getOptionClass(idx)}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <span className="inline-block w-8 text-[#9C8C7A] font-medium">
                      {String.fromCharCode(97 + idx)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== COMPLETE STATE ===== */}
          {!quizCompleted && phase === 'complete' && (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
              <h3
                className="text-3xl sm:text-4xl text-[#2C2420] text-center"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                Perfect! All 10 correct!
              </h3>
              <p
                className="text-[#9C8C7A] mt-4 text-sm tracking-wider"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                You know Annie well{' '}
                <span className="inline-block">:)</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== WRONG ANSWER MODAL ===== */}
      {phase === 'modal' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-3xl font-bold">✕</span>
            </div>
            <h3
              className="text-2xl text-[#2C2420] mb-2"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Wrong Answer!
            </h3>
            <p
              className="text-[#9C8C7A] text-sm mb-8"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Don&apos;t worry, you can try again!
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="w-full py-3 rounded-full bg-black text-white text-base font-medium hover:bg-black/80 transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Retry
              </button>
              <button
                onClick={handleExit}
                className="w-full py-3 rounded-full border-2 border-[#E8DCC8] text-[#5C4E3E] text-base font-medium hover:bg-[#FAF6F0] transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}