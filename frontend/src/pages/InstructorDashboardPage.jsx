import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool,
  Plus,
  Users,
  DollarSign,
  Star,
  Award,
  BookOpen,
  Trash2,
  ExternalLink,
  CheckCircle,
  X,
  FilePlus,
  Video,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import { instructorService } from '../services/instructorService';
import { useAuth } from '../context/AuthContext';

export default function InstructorDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New course form state
  const [newCourse, setNewCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 49.99,
    discountPrice: 29.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    sectionTitle: 'Core Architecture Essentials',
    lessonTitle: 'System Setup and Project Scaffolding',
    lessonVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    lessonDuration: '12:45',
  });

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes] = await Promise.allSettled([
        instructorService.getStats(),
        instructorService.getMyCourses(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.stats);
        setTrends(statsRes.value.monthlyTrends || []);
      }

      if (coursesRes.status === 'fulfilled' && coursesRes.value.success) {
        setCourses(coursesRes.value.courses || []);
      }
    } catch (err) {
      console.error('Failed to load instructor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Create Course
      const courseRes = await instructorService.createCourse({
        title: newCourse.title,
        subtitle: newCourse.subtitle,
        description: newCourse.description,
        category: newCourse.category,
        level: newCourse.level,
        price: newCourse.isFree ? 0 : Number(newCourse.price),
        discountPrice: Number(newCourse.discountPrice),
        isFree: newCourse.isFree,
        thumbnail: newCourse.thumbnail,
        trailerVideoUrl: newCourse.trailerVideoUrl,
      });

      if (courseRes.success && courseRes.course) {
        const createdCourseId = courseRes.course._id;

        // 2. Add initial Section
        const secRes = await instructorService.addSection(createdCourseId, {
          title: newCourse.sectionTitle || 'Section 1: Foundations',
          order: 1,
        });

        // 3. Add initial Lesson
        if (secRes.success && secRes.section) {
          await instructorService.addLesson(secRes.section._id, {
            title: newCourse.lessonTitle || 'Lesson 1: Scaffolding',
            videoUrl: newCourse.lessonVideoUrl,
            duration: newCourse.lessonDuration,
            isFreePreview: true,
          });
        }

        // Close modal & refresh
        setModalOpen(false);
        await fetchInstructorData();
      }
    } catch (err) {
      console.error('Failed to create course:', err);
      alert(err.response?.data?.message || 'Error creating course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await instructorService.deleteCourse(courseId);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Instructor Studio & Authoring
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your courses, monitor student analytics, and build new masterclasses.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={(stats?.totalStudents || 0).toLocaleString()}
          icon={Users}
          color="brand"
          trend="+18% vs last mo"
        />
        <StatCard
          title="Total Gross Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
          trend="+22% revenue"
        />
        <StatCard
          title="Avg Rating"
          value={`${stats?.avgRating || '5.0'} ★`}
          icon={Star}
          color="amber"
          subtitle="From student reviews"
        />
        <StatCard
          title="Quiz Pass Rate"
          value={`${stats?.quizPassRate || 92}%`}
          icon={Award}
          color="cyan"
          subtitle="Assessment proficiency"
        />
      </div>

      {/* Analytics Chart */}
      {trends.length > 0 && (
        <AnalyticsChart data={trends} title="Instructor Revenue & Enrollment Analytics" />
      )}

      {/* Created Courses Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              My Authored Courses ({courses.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your active curricula, sections, and student pricing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-dark-850/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No courses created yet. Click "Create New Course" above to author your first masterclass!
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {course.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {course.sections?.length || 0} sections
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {course.category}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {course.isFree ? 'Free' : `$${course.price?.toFixed(2)}`}
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {(course.studentsCount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-amber-500">
                      {course.rating || 5} ★
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/course/${course.slug || course._id}`}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                          title="Preview Course"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Course Creation Wizard
                </h3>
                <p className="text-xs text-slate-500">Configure curriculum, video lesson, and pricing</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Advanced Distributed Systems in Go"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.subtitle}
                  onChange={(e) => setNewCourse({ ...newCourse, subtitle: e.target.value })}
                  placeholder="Short compelling summary for learners"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discipline Category
                  </label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Skill Level
                  </label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCourse.discountPrice}
                    onChange={(e) => setNewCourse({ ...newCourse, discountPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Course Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Detailed breakdown of modules, outcomes, and prerequisites..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Initial Curriculum Section & Lesson */}
              <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-3">
                <span className="font-bold text-brand-600 dark:text-brand-400 block">
                  Initial Section & First Video Lesson
                </span>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={newCourse.sectionTitle}
                    onChange={(e) => setNewCourse({ ...newCourse, sectionTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Lesson Title</label>
                    <input
                      type="text"
                      value={newCourse.lessonTitle}
                      onChange={(e) => setNewCourse({ ...newCourse, lessonTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newCourse.lessonDuration}
                      onChange={(e) => setNewCourse({ ...newCourse, lessonDuration: e.target.value })}
                      placeholder="e.g. 14:20"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Publishing Course...' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
