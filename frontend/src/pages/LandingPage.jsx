import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  Code2,
  Cpu,
  Cloud,
  Palette,
  Terminal,
  CheckCircle,
  Star,
  Users,
  Award,
} from 'lucide-react';
import HeroScene from '../components/3d/HeroScene';
import RevealOnScroll from '../components/animations/RevealOnScroll';
import CounterAnimation from '../components/animations/CounterAnimation';
import CourseCard from '../components/course/CourseCard';
import { courseService } from '../services/courseService';

const CATEGORY_ITEMS = [
  { name: 'Web Development', icon: Code2, count: 24, color: 'text-indigo-500 bg-indigo-500/10' },
  { name: 'AI & Machine Learning', icon: Cpu, count: 18, color: 'text-purple-500 bg-purple-500/10' },
  { name: 'Cloud & DevOps', icon: Cloud, count: 16, color: 'text-sky-500 bg-sky-500/10' },
  { name: 'UI/UX Design', icon: Palette, count: 14, color: 'text-pink-500 bg-pink-500/10' },
  { name: 'Cybersecurity', icon: ShieldCheck, count: 12, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'Software Engineering', icon: Terminal, count: 20, color: 'text-amber-500 bg-amber-500/10' },
];

export default function LandingPage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await courseService.getFeaturedCourses();
        if (res.success) {
          setFeaturedCourses(res.courses || []);
        }
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] mesh-glow-bg pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-300/40 dark:border-brand-800/40 shadow-sm animate-pulse-glow">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Next-Gen Interactive LMS 2.0
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Architect Your <br className="hidden sm:inline" />
              <span className="text-gradient">Engineering Future</span> With Mastery
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Immerse yourself in interactive 3D simulations, real-time WebSocket peer threads, and battle-tested curricula crafted by Staff Engineers from Netflix, Stanford, and DeepMind.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-dark-800 font-bold text-sm shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>1-Click Demo Accounts</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Free Preview Lessons
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Verifiable PDF Certificates
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Live Socket.io Q&A
              </span>
            </div>
          </div>

          {/* Right 3D Interactive Canvas */}
          <div className="lg:col-span-5 h-[380px] sm:h-[480px] lg:h-[550px] relative w-full flex items-center justify-center">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* ANIMATED STATS SECTION */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-dark-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <RevealOnScroll delay={0.1}>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                  <CounterAnimation target={50000} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Global Software Engineers
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-brand-600 dark:text-brand-400">
                  <CounterAnimation target={4.9} decimals={1} prefix="" suffix=" ★" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Average Learner Rating
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                  <CounterAnimation target={98} suffix="%" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Assessment Pass Rate
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-cyan-600 dark:text-cyan-400">
                  <CounterAnimation target={120} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Production Masterclasses
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              Top-Tier Curricula
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
              Featured Production Masterclasses
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.slice(0, 6).map((course, idx) => (
            <RevealOnScroll key={course._id} delay={idx * 0.1} direction="up">
              <CourseCard course={course} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* DISCIPLINE CATEGORIES GRID */}
      <section className="py-16 bg-slate-100/50 dark:bg-dark-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              Deep Specializations
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
              Explore Industry Disciplines
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From low-level microservices to high-fidelity design systems, choose your trajectory.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_ITEMS.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <RevealOnScroll key={cat.name} delay={idx * 0.08} direction="up">
                  <Link
                    to={`/courses?category=${encodeURIComponent(cat.name)}`}
                    className="glass-card rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:scale-105 transition-all group"
                  >
                    <div className={`p-3 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {cat.count} courses
                      </span>
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY AURA LMS STORYTELLING / FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block">
              Architectural Excellence
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white leading-tight">
              Designed for Engineers Who Demand <span className="text-gradient">Real Craftsmanship</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Traditional online courses are static and disconnected. Aura LMS combines real-time WebSockets, 3D spatial models, auto-grading assessment engines, and instant verified certifications to mirror high-intensity software engineering environments.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 shrink-0 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Live Real-Time Socket.io Peer Discussions
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Collaborate with peers watching the exact same lesson in real-time, get answers, and learn together.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0 mt-1">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Official Cryptographic Certificates
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Instantly verifiable certificates with unique serial numbers, printable PDF export, and 3D badge trophies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0 mt-1">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Instructor Course Studio & Analytics
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Instructors build curriculum sections, configure video lessons, author quizzes, and monitor revenue with Recharts graphs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                100%
              </div>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Auto-Graded Quizzes
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step timed assessments with instant answer explanations and celebration confetti.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                3D
              </div>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Interactive Three.js
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hardware-accelerated WebGL scenes responding smoothly to cursor coordinates and scroll triggers.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 sm:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                RBAC
              </div>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Multi-Role Security (Admin, Instructor, Student)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full-fledged role-based access control with course approval workflows, student progress trackers, and user moderation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-dark-950 p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl border border-brand-500/30">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-brand-300 backdrop-blur-md">
              Start Learning in 10 Seconds
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Join tens of thousands of software engineers learning with Aura LMS. Test the platform instantly with our built-in 1-click Demo credentials.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Open Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
