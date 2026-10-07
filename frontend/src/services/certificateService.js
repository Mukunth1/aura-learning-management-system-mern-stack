import api from './api';

export const certificateService = {
  async getCertificate(id) {
    const res = await api.get(`/certificates/${id}`);
    return res.data;
  },

  async verifyCertificate(certificateId) {
    const res = await api.get(`/certificates/verify/${certificateId}`);
    return res.data;
  },
};
