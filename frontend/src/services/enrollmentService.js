import api from './api';

export const enrollmentService = {
  async enroll(courseId) {
    const res = await api.post(`/enrollments/enroll/${courseId}`);
    return res.data;
  },

  async getMyCourses() {
    const res = await api.get('/enrollments/my-courses');
    return res.data;
  },

  async getCourseProgress(courseId) {
    const res = await api.get(`/enrollments/course/${courseId}`);
    return res.data;
  },

  async markLessonComplete(courseId, lessonId) {
    const res = await api.post(`/enrollments/course/${courseId}/lesson/${lessonId}/complete`);
    return res.data;
  },
};
