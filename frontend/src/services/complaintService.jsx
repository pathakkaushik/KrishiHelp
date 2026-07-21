import api from './api.jsx'

const complaintService = {
  async getComplaints(params = {}) {
    return await api.get('/complaints', { params })
  },

  async getComplaintById(id) {
    return await api.get(`/complaints/${id}`)
  },

  async createComplaint(data) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach(file => formData.append('attachments', file))
      } else if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })
    return await api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async updateComplaint(id, data) {
    return await api.put(`/complaints/${id}`, data)
  },

  async updateStatus(id, data) {
    return await api.patch(`/complaints/${id}/status`, data)
  },

  async deleteComplaint(id) {
    return await api.delete(`/complaints/${id}`)
  },

  async getComplaintTimeline(id) {
    return await api.get(`/complaints/${id}/timeline`)
  },

  async escalateComplaint(id, reason) {
    return await api.post(`/complaints/${id}/escalate`, { reason })
  },

  async submitFeedback(id, feedback) {
    return await api.post(`/complaints/${id}/feedback`, feedback)
  },

  async voteComplaint(id, type) {
    return await api.post(`/complaints/${id}/vote`, { type })
  },

  async getMyComplaints(params = {}) {
    return await api.get('/complaints/my', { params })
  },

  async getComplaintStats() {
    return await api.get('/complaints/stats')
  },

  async getCommunityComplaints(params = {}) {
    return await api.get('/complaints/community', { params })
  },

  async checkDuplicate(title, description) {
    return await api.post('/complaints/check-duplicate', { title, description })
  },

  async assignComplaint(id, officerId) {
    return await api.patch(`/complaints/${id}/assign`, { officerId })
  },
}

export default complaintService
