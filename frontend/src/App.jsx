import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import SmoothScroll from './components/animations/SmoothScroll';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import QuizPage from './pages/QuizPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import CertificatePage from './pages/CertificatePage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const location = useLocation();
  const isLearningPlayer = location.pathname.startsWith('/learn/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/course/:idOrSlug" element={<CourseDetailsPage />} />
          <Route path="/certificate/:id" element={<CertificatePage />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <LearningPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:courseId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Instructor Protected Routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <InstructorDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-4xl font-extrabold font-display mb-2">404</h2>
                <p className="text-sm text-slate-500 mb-6">Page could not be found.</p>
                <a
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      {!isLearningPlayer && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <SmoothScroll>
            <Router>
              <AppContent />
            </Router>
          </SmoothScroll>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
