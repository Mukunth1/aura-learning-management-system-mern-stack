import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import { adminService } from '../services/adminService';

export default function AdminPanelPage() {
  const [metrics, setMetrics] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'moderation' | 'analytics'
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes, pendingRes] = await Promise.allSettled([
        adminService.getMetrics(),
        adminService.getUsers({ search: userSearch, role: userRoleFilter }),
        adminService.getPendingCourses(),
      ]);

      if (metricsRes.status === 'fulfilled' && metricsRes.value.success) {
        setMetrics(metricsRes.value.metrics);
        setGrowthData(metricsRes.value.growthData || []);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.users || []);
      }

      if (pendingRes.status === 'fulfilled' && pendingRes.value.success) {
        setPendingCourses(pendingRes.value.courses || []);
      }
    } catch (err) {
      console.error('Failed to load admin console:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userRoleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      const res = await adminService.approveCourse(courseId);
      if (res.success) {
        setPendingCourses((prev) => prev.filter((c) => c._id !== courseId));
        alert('Course approved and published!');
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectCourse = async (courseId) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (!reason) return;
    try {
      const res = await adminService.rejectCourse(courseId, reason);
      if (res.success) {
        setPendingCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Super Admin Console
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Platform Governance & Operations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor ecosystem health, user accounts, and course approval queues.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform Users"
          value={(metrics?.totalUsers || 0).toLocaleString()}
          icon={Users}
          color="brand"
          subtitle={`${metrics?.studentsCount || 0} students, ${metrics?.instructorsCount || 0} instructors`}
        />
        <StatCard
          title="Published Courses"
          value={(metrics?.publishedCourses || 0).toLocaleString()}
          icon={BookOpen}
          color="cyan"
          subtitle={`${metrics?.pendingCourses || 0} pending review`}
        />
        <StatCard
          title="Gross Volume"
          value={`$${(metrics?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
          subtitle="All transactions"
        />
        <StatCard
          title="Issued Certificates"
          value={(metrics?.totalCertificates || 0).toLocaleString()}
          icon={Award}
          color="amber"
          subtitle="Officially verified"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          Course Approval Queue ({pendingCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Growth Analytics
        </button>
      </div>

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </form>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Roles</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-dark-850/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Change Role</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : u.role === 'instructor'
                            ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 text-[11px] rounded-lg bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Course Moderation */}
      {activeTab === 'moderation' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Courses Pending Review ({pendingCourses.length})
              </h3>
              <p className="text-xs text-slate-500">
                Audit submitted masterclasses before releasing them to the public course catalog.
              </p>
            </div>
          </div>

          {pendingCourses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                All course submissions are up to date!
              </p>
              <p className="text-[11px] text-slate-400">No courses pending moderation review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((c) => (
                <div
                  key={c._id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-dark-850/60 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-16 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500">
                        By {c.instructor?.name} • Category: {c.category} • Price: ${c.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveCourse(c._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleRejectCourse(c._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Growth Analytics */}
      {activeTab === 'analytics' && (
        <AnalyticsChart data={growthData} title="Ecosystem Platform User & Enrollment Growth" />
      )}
    </div>
  );
}
