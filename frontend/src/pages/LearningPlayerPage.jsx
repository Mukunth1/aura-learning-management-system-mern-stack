import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  FileText,
  Award,
  CheckCircle2,
  Download,
  Share2,
} from 'lucide-react';
import VideoPlayer from '../components/player/VideoPlayer';
import LessonSidebar from '../components/player/LessonSidebar';
import LessonNotes from '../components/player/LessonNotes';
import RealtimeDiscussion from '../components/player/RealtimeDiscussion';
import QuizPlayer from '../components/quiz/QuizPlayer';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { quizService } from '../services/quizService';

export default function LearningPlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'notes' | 'discussion' | 'quiz'
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseRes = await courseService.getCourseDetails(courseId);
        if (courseRes.success) {
          setCourse(courseRes.course);

          // Find first lesson default
          let initialLesson = null;
          if (courseRes.course.sections && courseRes.course.sections.length > 0) {
            for (const sec of courseRes.course.sections) {
              if (sec.lessons && sec.lessons.length > 0) {
                initialLesson = sec.lessons[0];
                break;
              }
            }
          }
          setActiveLesson(initialLesson);
        }

        // Fetch enrollment & progress
        try {
          const enrollRes = await enrollmentService.getCourseProgress(courseId);
          if (enrollRes.isEnrolled) {
            setEnrollment(enrollRes.enrollment);
            setProgress(enrollRes.enrollment.progress || 0);
            setCompletedLessonIds(enrollRes.enrollment.completedLessons || []);
          }
        } catch (e) {
          console.warn('Student not currently enrolled, enrolling now...');
          await enrollmentService.enroll(courseId);
          const enrollRes = await enrollmentService.getCourseProgress(courseId);
          if (enrollRes.isEnrolled) {
            setEnrollment(enrollRes.enrollment);
            setProgress(enrollRes.enrollment.progress || 0);
            setCompletedLessonIds(enrollRes.enrollment.completedLessons || []);
          }
        }

        // Fetch Quiz if present
        try {
          const quizRes = await quizService.getQuizByCourse(courseId);
          if (quizRes.success) {
            setQuiz(quizRes.quiz);
          }
        } catch (e) {
          // No quiz
        }
      } catch (err) {
        console.error('Failed to load learning player session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  const handleLessonComplete = async (lessonIdToComplete = null) => {
    const targetId = lessonIdToComplete || activeLesson?._id;
    if (!targetId) return;

    try {
      const res = await enrollmentService.markLessonComplete(courseId, targetId);
      if (res.success) {
        setProgress(res.progress);
        setCompletedLessonIds(res.completedLessons);
        if (res.certificateId) {
          setEnrollment((prev) => ({ ...prev, certificate: res.certificateId, certificateIssued: true }));
        }
      }
    } catch (err) {
      console.error('Failed to update lesson completion status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Initializing your learning environment...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-36 text-center">
        <h2 className="text-xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="text-brand-500 underline mt-2 block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isCurrentLessonCompleted = completedLessonIds.some(
    (id) => id.toString() === (activeLesson?._id || '').toString()
  );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-dark-950 transition-colors">
      {/* Top Learning Navigation Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-dark-900/70 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          <div className="flex-1 text-center max-w-xl truncate px-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {course.title}
            </h2>
            <p className="text-[11px] text-slate-500 truncate">{activeLesson?.title}</p>
          </div>

          <div className="flex items-center gap-3">
            {progress === 100 && enrollment?.certificate && (
              <Link
                to={`/certificate/${enrollment.certificate?._id || enrollment.certificate}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
              >
                <Award className="w-4 h-4" />
                Certificate
              </Link>
            )}

            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {progress}% done
            </span>
          </div>
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left / Center: Video Player & Tabs */}
          <div className="flex-1 w-full space-y-6">
            {/* Custom Video Player Component */}
            <VideoPlayer
              videoUrl={activeLesson?.videoUrl}
              title={activeLesson?.title}
              isCompleted={isCurrentLessonCompleted}
              onComplete={() => handleLessonComplete(activeLesson?._id)}
            />

            {/* Lesson Title & Quick Mark Completed Action */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Current Lesson
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                  {activeLesson?.title}
                </h3>
              </div>

              <button
                onClick={() => handleLessonComplete(activeLesson?._id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCurrentLessonCompleted ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>

            {/* Interactive Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Overview & Resources
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'notes'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Study Notes
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'discussion'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Live Q&A Thread
              </button>

              {quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Course Assessment Quiz
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'overview' && (
                <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                      Lesson Description
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeLesson?.description || 'Follow along with the hands-on video demonstration above.'}
                    </p>
                  </div>

                  {/* PDF Downloads & Resources */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-3">
                      Lesson Downloads & Study Material
                    </h4>
                    <div className="space-y-2">
                      <a
                        href={activeLesson?.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-dark-850/60 hover:border-brand-500 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500">
                              {activeLesson?.title} - Code Cheatsheet & Architecture Blueprint (PDF)
                            </p>
                            <span className="text-[10px] text-slate-400">PDF Document • 2.4 MB</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-500" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
                  <LessonNotes
                    lessonId={activeLesson?._id}
                    lessonTitle={activeLesson?.title}
                  />
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
                  <RealtimeDiscussion
                    lessonId={activeLesson?._id}
                    courseId={course._id}
                  />
                </div>
              )}

              {activeTab === 'quiz' && quiz && (
                <QuizPlayer
                  quiz={quiz}
                  courseId={course._id}
                  onCompleted={() => {
                    handleLessonComplete();
                  }}
                />
              )}
            </div>
          </div>

          {/* Right: Collapsible Curriculum Sidebar */}
          <LessonSidebar
            course={course}
            progress={progress}
            completedLessonIds={completedLessonIds}
            activeLesson={activeLesson}
            onSelectLesson={(lesson) => {
              setActiveLesson(lesson);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleCompleteLesson={(lessonId) => handleLessonComplete(lessonId)}
            certificateId={enrollment?.certificate?._id || enrollment?.certificate}
          />
        </div>
      </div>
    </div>
  );
}
