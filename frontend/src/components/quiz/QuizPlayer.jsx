import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Award, RotateCcw, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizService } from '../../services/quizService';

export default function QuizPlayer({ quiz, courseId, onCompleted }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimitMinutes || 15) * 60);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  // Timer countdown
  useEffect(() => {
    if (results || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [results, timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (results) return; // Prevent change after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting || results) return;
    setIsSubmitting(true);

    const answersPayload = Object.entries(selectedAnswers).map(([qIdx, optIdx]) => ({
      questionIndex: parseInt(qIdx, 10),
      selectedOptionIndex: optIdx,
    }));

    try {
      const res = await quizService.submitQuiz(quiz._id, answersPayload);
      if (res.success) {
        setResults(res);
        if (res.passed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        if (onCompleted) onCompleted(res);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setResults(null);
    setTimeLeft((quiz.timeLimitMinutes || 15) * 60);
  };

  // If results submitted, show detailed analytics review
  if (results) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in duration-300">
        {/* Results Banner */}
        <div
          className={`p-6 rounded-2xl text-center space-y-3 ${
            results.passed
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white dark:bg-dark-900 shadow-md">
            {results.passed ? (
              <Award className="w-8 h-8 text-emerald-500" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-500" />
            )}
          </div>

          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            {results.passed ? 'Assessment Passed with Distinction!' : 'Passing Threshold Not Met'}
          </h3>

          <p className="text-sm max-w-md mx-auto">
            {results.message}
          </p>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div>
              <span className="text-xs uppercase tracking-wider block text-slate-400">Score</span>
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {results.score}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-xs uppercase tracking-wider block text-slate-400">Passing Grade</span>
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {results.passingScore}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-xs uppercase tracking-wider block text-slate-400">Correct</span>
              <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {results.correctCount}/{results.totalQuestions}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-850 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>
        </div>

        {/* Question by question detailed explanation review */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Detailed Answers & Explanations Review
          </h4>

          {results.detailedResults?.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                item.isCorrect
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-rose-500/40 bg-rose-500/5'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {idx + 1}. {item.question}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {item.options?.map((opt, optIdx) => {
                      const isSelected = item.selectedOptionIndex === optIdx;
                      const isCorrect = item.correctAnswerIndex === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold'
                              : isSelected && !isCorrect
                              ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 line-through'
                              : 'bg-white/60 dark:bg-dark-800/60 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                              Correct Answer
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-[10px] uppercase font-bold text-rose-500">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-900/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-brand-600 dark:text-brand-400 block mb-0.5">
                      Expert Explanation:
                    </span>
                    {item.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active quiz taking view
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {quiz.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Passing threshold: <span className="font-bold text-brand-500">{quiz.passingScore}%</span>
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestionIdx(idx)}
            className={`h-2 rounded-full transition-all duration-200 ${
              idx === currentQuestionIdx
                ? 'w-8 bg-brand-600'
                : selectedAnswers[idx] !== undefined
                ? 'w-4 bg-emerald-500'
                : 'w-4 bg-slate-200 dark:bg-dark-800'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <h4 className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQuestion.options?.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between border ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-md shadow-brand-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-dark-850/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIdx === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 disabled:opacity-30 transition-colors"
        >
          Previous
        </button>

        {currentQuestionIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Evaluating Assessment...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
