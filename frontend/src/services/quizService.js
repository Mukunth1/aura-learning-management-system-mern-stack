import api from './api';

export const quizService = {
  async getQuizByCourse(courseId) {
    const res = await api.get(`/quizzes/course/${courseId}`);
    return res.data;
  },

  async submitQuiz(quizId, answers) {
    const res = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return res.data;
  },

  async getMyAttempts() {
    const res = await api.get('/quizzes/my-attempts');
    return res.data;
  },
};
