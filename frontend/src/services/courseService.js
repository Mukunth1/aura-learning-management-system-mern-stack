import api from './api';

export const courseService = {
  // Get all courses with query parameters
  async getCourses(params = {}) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  // Get featured courses
  async getFeaturedCourses() {
    const res = await api.get('/courses/featured');
    return res.data;
  },

  // Get course by slug or ID
  async getCourseDetails(idOrSlug) {
    const res = await api.get(`/courses/${idOrSlug}`);
    return res.data;
  },

  // Get category listing
  async getCategories() {
    const res = await api.get('/courses/categories');
    return res.data;
  },
};
