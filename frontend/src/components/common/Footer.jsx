import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Zap, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-dark-950/80 backdrop-blur-md pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-brand-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                Aura<span className="text-brand-500">LMS</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering global software architects, AI researchers, and digital designers with interactive 3D learning, real-time peer mentorship, and industry-accredited credentials.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/instructor" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Instructor Studio
                </Link>
              </li>
              <li>
                <Link to="/certificate/LMS-2026-X9K2W7QP" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Certificate Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Top Disciplines
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/courses?category=Web+Development" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Web Architecture
                </Link>
              </li>
              <li>
                <Link to="/courses?category=AI+%26+Machine+Learning" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Generative AI & LLMs
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud+%26+DevOps" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Cloud & Kubernetes
                </Link>
              </li>
              <li>
                <Link to="/courses?category=UI%2FUX+Design" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Design Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Enterprise Trust
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Built with end-to-end encryption, WCAG AA accessibility, and verified cryptographic certificates.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> SOC2 Type II Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Ultra-Low Latency Streams
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Aura LMS Platform, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
