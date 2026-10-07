import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CourseCard from '../components/course/CourseCard';
import { CourseCardSkeleton } from '../components/common/SkeletonLoader';
import { enrollmentService } from '../services/enrollmentService';
import { quizService } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [enrollRes, quizRes] = await Promise.allSettled([
          enrollmentService.getMyCourses(),
          quizService.getMyAttempts(),
        ]);

        if (enrollRes.status === 'fulfilled' && enrollRes.value.success) {
          setEnrollments(enrollRes.value.enrollments || []);
        }

        if (quizRes.status === 'fulfilled' && quizRes.value.success) {
          setQuizAttempts(quizRes.value.attempts || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'completed' || e.progress === 100);
  const inProgressCourses = enrollments.filter((e) => e.status === 'active' && e.progress < 100);
  const certificatesEarned = enrollments.filter((e) => e.certificateIssued && e.certificate);

  // Resume course: active with highest progress
  const resumeCourse = inProgressCourses[0] || enrollments[0];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Student Learning Command Center
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick up right where you left off and advance towards your master certification.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Courses</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={totalEnrolled}
          icon={BookOpen}
          color="brand"
          subtitle="Active curricula"
        />
        <StatCard
          title="In Progress"
          value={inProgressCourses.length}
          icon={Clock}
          color="cyan"
          subtitle="Currently studying"
        />
        <StatCard
          title="Completed"
          value={completedCourses.length}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Full completion"
        />
        <StatCard
          title="Certificates"
          value={certificatesEarned.length}
          icon={Award}
          color="amber"
          subtitle="Official credentials"
        />
      </div>

      {/* Resume Current Course Hero Banner */}
      {resumeCourse && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-900/90 via-indigo-950/80 to-dark-900 border border-brand-500/30 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Continue Where You Left Off
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-snug">
              {resumeCourse.course?.title}
            </h2>
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Progress</span>
                <span className="font-bold text-brand-400">{resumeCourse.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                  style={{ width: `${resumeCourse.progress}%` }}
                />
              </div>
            </div>
            <div className="pt-2">
              <Link
                to={`/learn/${resumeCourse.course?._id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Lesson</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            My Enrolled Courses ({enrollments.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              You haven't enrolled in any courses yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our catalog of production masterclasses and start your learning trajectory today.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enr) => (
              <CourseCard
                key={enr._id}
                course={enr.course}
                enrollment={enr}
              />
            ))}
          </div>
        )}
      </div>

      {/* Earned Certificates Gallery */}
      {certificatesEarned.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                Earned Official Certificates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified digital credentials with unique authenticity serial numbers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificatesEarned.map((enr) => {
              const certId = enr.certificate?.certificateId || enr.certificate?._id || enr.certificate;
              return (
                <div
                  key={enr._id}
                  className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {certId}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {enr.course?.title}
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {enr.certificate?.grade || 'Completed with Distinction'}
                    </p>
                  </div>

                  <Link
                    to={`/certificate/${certId}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <span>View & Download Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
