'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'annie-quiz-completed';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setQuizCompleted(true);
      }
    } catch {
      // localStorage unavailable (private browsing, SSR, etc.)
    }
    setInitialized(true);
  }, []);

  const completeQuiz = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
    setQuizCompleted(true);
  }, []);

  const resetQuiz = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    setQuizCompleted(false);
  }, []);

  const openLetter = useCallback(() => {
    setLetterOpen(true);
  }, []);

  const closeLetter = useCallback(() => {
    setLetterOpen(false);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizCompleted,
        letterOpen,
        initialized,
        completeQuiz,
        resetQuiz,
        openLetter,
        closeLetter,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return ctx;
}