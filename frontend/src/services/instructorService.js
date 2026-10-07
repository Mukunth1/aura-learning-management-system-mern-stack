import api from './api';

export const instructorService = {
  async getStats() {
    const res = await api.get('/instructor/stats');
    return res.data;
  },

  async getMyCourses() {
    const res = await api.get('/instructor/courses');
    return res.data;
  },

  async createCourse(data) {
    const res = await api.post('/instructor/courses', data);
    return res.data;
  },

  async updateCourse(id, data) {
    const res = await api.put(`/instructor/courses/${id}`, data);
    return res.data;
  },

  async deleteCourse(id) {
    const res = await api.delete(`/instructor/courses/${id}`);
    return res.data;
  },

  async addSection(courseId, data) {
    const res = await api.post(`/instructor/courses/${courseId}/sections`, data);
    return res.data;
  },

  async addLesson(sectionId, data) {
    const res = await api.post(`/instructor/sections/${sectionId}/lessons`, data);
    return res.data;
  },

  async saveQuiz(courseId, data) {
    const res = await api.post(`/instructor/courses/${courseId}/quiz`, data);
    return res.data;
  },
};
