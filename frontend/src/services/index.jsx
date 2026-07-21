import api from './api.jsx'

export const aiService = {
  async chat(message, history = []) {
    return await api.post('/ai/chat', { message, history })
  },

  async getChatHistory() {
    return await api.get('/ai/chat/history')
  },

  async clearChatHistory() {
    return await api.delete('/ai/chat/history')
  },

  async getSuggestedQuestions(context = '') {
    return await api.get('/ai/suggestions', { params: { context } })
  },

  async analyzeImage(formData) {
    return await api.post('/ai/crop-doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async analyzeSoil(formData) {
    return await api.post('/ai/soil-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async getSchemeRecommendations(profile) {
    return await api.post('/ai/scheme-recommendations', profile)
  },

  async getLoanRecommendations(data) {
    return await api.post('/ai/loan-recommendations', data)
  },
}

export const weatherService = {
  async getCurrentWeather(lat, lon) {
    return await api.get('/weather/current', { params: { lat, lon } })
  },

  async getForecast(lat, lon, days = 7) {
    return await api.get('/weather/forecast', { params: { lat, lon, days } })
  },

  async getAlerts(lat, lon) {
    return await api.get('/weather/alerts', { params: { lat, lon } })
  },

  async getFarmingAdvice(lat, lon) {
    return await api.get('/weather/farming-advice', { params: { lat, lon } })
  },
}

export const mandiService = {
  async getPrices(params = {}) {
    return await api.get('/mandi/prices', { params })
  },

  async getNearbyMandis(lat, lon) {
    return await api.get('/mandi/nearby', { params: { lat, lon } })
  },

  async getPriceHistory(cropName, mandiId, days = 30) {
    return await api.get(`/mandi/prices/history`, { params: { cropName, mandiId, days } })
  },

  async getPriceForecast(cropName) {
    return await api.get(`/mandi/prices/forecast`, { params: { cropName } })
  },
}

export const schemeService = {
  async getAllSchemes(params = {}) {
    return await api.get('/schemes', { params })
  },

  async getSchemeById(id) {
    return await api.get(`/schemes/${id}`)
  },

  async checkEligibility(schemeId, profileData) {
    return await api.post(`/schemes/${schemeId}/eligibility`, profileData)
  },

  async trackApplication(applicationId) {
    return await api.get(`/schemes/applications/${applicationId}`)
  },
}

export const livestockService = {
  async getAnimals() {
    return await api.get('/livestock')
  },

  async addAnimal(data) {
    return await api.post('/livestock', data)
  },

  async updateAnimal(id, data) {
    return await api.put(`/livestock/${id}`, data)
  },

  async getVaccinationSchedule(animalId) {
    return await api.get(`/livestock/${animalId}/vaccinations`)
  },

  async addVaccination(animalId, data) {
    return await api.post(`/livestock/${animalId}/vaccinations`, data)
  },

  async diagnoseDisease(formData) {
    return await api.post('/livestock/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const marketplaceService = {
  async getListings(params = {}) {
    return await api.get('/marketplace', { params })
  },

  async createListing(data) {
    return await api.post('/marketplace', data)
  },

  async getMyListings() {
    return await api.get('/marketplace/my')
  },

  async sendInquiry(listingId, message) {
    return await api.post(`/marketplace/${listingId}/inquire`, { message })
  },
}

export const equipmentService = {
  async getEquipment(params = {}) {
    return await api.get('/equipment', { params })
  },

  async bookEquipment(id, bookingData) {
    return await api.post(`/equipment/${id}/book`, bookingData)
  },

  async getMyBookings() {
    return await api.get('/equipment/bookings/my')
  },
}

export const calendarService = {
  async getEvents(params = {}) {
    return await api.get('/calendar', { params })
  },

  async createEvent(data) {
    return await api.post('/calendar', data)
  },

  async updateEvent(id, data) {
    return await api.put(`/calendar/${id}`, data)
  },

  async deleteEvent(id) {
    return await api.delete(`/calendar/${id}`)
  },

  async getAICalendar(cropData) {
    return await api.post('/calendar/ai-generate', cropData)
  },
}

export const sosService = {
  async triggerSOS(data) {
    return await api.post('/sos/trigger', data)
  },

  async getEmergencyContacts(lat, lon) {
    return await api.get('/sos/contacts', { params: { lat, lon } })
  },
}

export const documentService = {
  async getDocuments() {
    return await api.get('/documents')
  },

  async uploadDocument(formData) {
    return await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async deleteDocument(id) {
    return await api.delete(`/documents/${id}`)
  },

  async downloadDocument(id) {
    return await api.get(`/documents/${id}/download`, { responseType: 'blob' })
  },
}

export const newsService = {
  async getNews(params = {}) {
    return await api.get('/news', { params })
  },

  async getNewsById(id) {
    return await api.get(`/news/${id}`)
  },
}

export const notificationService = {
  async getNotifications() {
    return await api.get('/notifications')
  },

  async markRead(id) {
    return await api.patch(`/notifications/${id}/read`)
  },

  async markAllRead() {
    return await api.patch('/notifications/read-all')
  },
}

export const adminService = {
  async getDashboardStats() {
    return await api.get('/admin/stats')
  },

  async getUsers(params = {}) {
    return await api.get('/admin/users', { params })
  },

  async updateUserRole(userId, role) {
    return await api.patch(`/admin/users/${userId}/role`, { role })
  },

  async getOfficers() {
    return await api.get('/admin/officers')
  },

  async createOfficer(data) {
    return await api.post('/admin/officers', data)
  },

  async getVillageAnalytics() {
    return await api.get('/admin/analytics/villages')
  },

  async getDepartmentAnalytics() {
    return await api.get('/admin/analytics/departments')
  },

  async getResolutionAnalytics() {
    return await api.get('/admin/analytics/resolution')
  },

  async exportReport(type, params = {}) {
    return await api.get(`/admin/reports/${type}`, {
      params,
      responseType: 'blob',
    })
  },
}
