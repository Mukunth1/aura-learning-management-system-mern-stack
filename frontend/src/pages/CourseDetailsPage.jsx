import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  BookOpen,
  ShieldCheck,
  Star,
  Globe,
  Share2,
  FileText,
  Lock,
} from 'lucide-react';
import CurriculumAccordion from '../components/course/CurriculumAccordion';
import StarRating from '../components/common/StarRating';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailsPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [previewVideoModal, setPreviewVideoModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseDetails(idOrSlug);
        if (res.success) {
          setCourse(res.course);
          setReviews(res.reviews || []);

          // Check enrollment if authenticated
          if (isAuthenticated && res.course?._id) {
            try {
              const enrollRes = await enrollmentService.getCourseProgress(res.course._id);
              if (enrollRes.isEnrolled) {
                setIsEnrolled(true);
                setEnrollment(enrollRes.enrollment);
              }
            } catch (e) {
              setIsEnrolled(false);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [idOrSlug, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/course/${idOrSlug}` } } });
      return;
    }

    try {
      setEnrolling(true);
      const res = await enrollmentService.enroll(course._id);
      if (res.success) {
        setIsEnrolled(true);
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading masterclass syllabus...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-36 text-center">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="text-brand-500 underline mt-2 block">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  // Calculate total lessons and total duration
  let totalLessons = 0;
  if (course.sections) {
    course.sections.forEach((sec) => {
      if (sec.lessons) totalLessons += sec.lessons.length;
    });
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Course Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60">
              {course.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-dark-850 text-slate-600 dark:text-slate-300">
              {course.level} Level
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white leading-[1.15]">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
            <StarRating rating={course.rating || 5} reviewsCount={course.numReviews || 0} size="md" />
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-brand-500" />
              <span>{(course.studentsCount || 0).toLocaleString()} enrolled learners</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{totalLessons} lessons included</span>
            </div>
          </div>

          {/* Instructor Brief */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={course.instructor?.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <p className="text-xs text-slate-400">Authored by</p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {course.instructor?.name}
              </h4>
              <p className="text-xs text-slate-500 truncate max-w-sm">{course.instructor?.headline}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-5 p-6">
            {/* Thumbnail Video Teaser Preview */}
            <div
              onClick={() => setPreviewVideoModal(true)}
              className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                Preview Course Trailer
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline justify-between">
              <div>
                {course.isFree || course.price === 0 ? (
                  <span className="text-3xl font-extrabold text-emerald-500 font-display">
                    FREE
                  </span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                      ${course.discountPrice > 0 ? course.discountPrice.toFixed(2) : course.price.toFixed(2)}
                    </span>
                    {course.discountPrice > 0 && (
                      <span className="text-sm text-slate-400 line-through">
                        ${course.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {course.discountPrice > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
                  Save {(100 - (course.discountPrice / course.price) * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {/* Action Button */}
            {isEnrolled ? (
              <Link
                to={`/learn/${course._id}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Resume Learning ({enrollment?.progress || 0}%)
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll for Free' : 'Enroll in Masterclass'}
              </button>
            )}

            {/* Guarantees and features checklist */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Full lifetime access on desktop & mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Official verifiable certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Downloadable code repos & study cheat sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Real-time lesson Q&A discussion with peers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-8 space-y-10">
          {/* What You Will Learn Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              What You Will Master
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {course.whatYouWillLearn?.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Curriculum Syllabus
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {course.sections?.length || 0} sections • {totalLessons} lessons
                </p>
              </div>
            </div>

            <CurriculumAccordion sections={course.sections || []} />
          </div>

          {/* Detailed Course Description */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Course In-Depth Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Instructor Profile Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              About the Instructor
            </h3>
            <div className="flex items-start gap-4">
              <img
                src={course.instructor?.avatar}
                alt={course.instructor?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 shrink-0"
              />
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {course.instructor?.name}
                </h4>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {course.instructor?.headline}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {course.instructor?.bio || 'Passionate industry veteran with deep engineering expertise.'}
                </p>
              </div>
            </div>
          </div>

          {/* Student Reviews & Ratings Breakdown */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Learner Reviews & Ratings
              </h3>
              <StarRating rating={course.rating || 5} reviewsCount={reviews.length} size="md" />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No reviews yet for this course.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={rev.user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.user?.name}
                          </p>
                          <StarRating rating={rev.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Modal */}
      {previewVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl glass-card rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-dark-900">
              <h4 className="text-sm font-bold text-white truncate">{course.title} - Preview Trailer</h4>
              <button
                onClick={() => setPreviewVideoModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={course.trailerVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
