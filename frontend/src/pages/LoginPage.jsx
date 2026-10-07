import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, Shield, GraduationCap, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (res.user.role === 'instructor') {
          navigate('/instructor', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login(demoEmail, demoPassword).then((res) => {
      if (res.success) {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'instructor') navigate('/instructor');
        else navigate('/dashboard');
      }
    }).catch((err) => {
      setError(err.response?.data?.message || 'Demo login failed');
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Aura<span className="text-brand-500">LMS</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to continue your masterclass trajectory
          </p>
        </div>

        {/* 1-CLICK QUICK DEMO ACCOUNTS BAR */}
        <div className="p-4 rounded-2xl glass-card border border-brand-500/30 bg-brand-500/5 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Instant Demo Evaluation
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student@lms.com', 'password123')}
              className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-dark-850/80 hover:border-brand-500 hover:scale-102 transition-all flex flex-col items-center gap-1 text-center"
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('instructor@lms.com', 'password123')}
              className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-dark-850/80 hover:border-brand-500 hover:scale-102 transition-all flex flex-col items-center gap-1 text-center"
            >
              <PenTool className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@lms.com', 'password123')}
              className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-dark-850/80 hover:border-brand-500 hover:scale-102 transition-all flex flex-col items-center gap-1 text-center"
            >
              <Shield className="w-4 h-4 text-rose-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Admin</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@lms.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
