import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, HelpCircle } from 'lucide-react';
import QuizPlayer from '../components/quiz/QuizPlayer';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';

export default function QuizPage() {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const [quizRes, courseRes] = await Promise.allSettled([
          quizService.getQuizByCourse(courseId),
          courseService.getCourseDetails(courseId),
        ]);

        if (quizRes.status === 'fulfilled' && quizRes.value.success) {
          setQuiz(quizRes.value.quiz);
        }

        if (courseRes.status === 'fulfilled' && courseRes.value.success) {
          setCourse(courseRes.value.course);
        }
      } catch (err) {
        console.error('Quiz loading failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Preparing assessment engine...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold">Assessment Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No quiz has been published for this course yet.
        </p>
        <Link to={`/course/${courseId}`} className="text-brand-500 underline text-xs font-semibold">
          Return to Course Details
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={`/learn/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Learning Theatre
        </Link>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
          <Award className="w-4 h-4" />
          Official Competency Evaluation
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          {quiz.title}
        </h1>
        {course && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Course: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.title}</span>
          </p>
        )}
      </div>

      <QuizPlayer quiz={quiz} courseId={courseId} />
    </div>
  );
}
