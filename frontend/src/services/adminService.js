import api from './api';

export const adminService = {
  async getMetrics() {
    const res = await api.get('/admin/metrics');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async deleteUser(userId) {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  async getPendingCourses() {
    const res = await api.get('/admin/courses/pending');
    return res.data;
  },

  async approveCourse(courseId) {
    const res = await api.put(`/admin/courses/${courseId}/approve`);
    return res.data;
  },

  async rejectCourse(courseId, reason) {
    const res = await api.put(`/admin/courses/${courseId}/reject`, { reason });
    return res.data;
  },
};
