import api from './api.jsx'

const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('krishimitra_token', response.token)
      localStorage.setItem('krishimitra_user', JSON.stringify(response.user))
    }
    return response
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.token) {
      localStorage.setItem('krishimitra_token', response.token)
      localStorage.setItem('krishimitra_user', JSON.stringify(response.user))
    }
    return response
  },

  async logout() {
    localStorage.removeItem('krishimitra_token')
    localStorage.removeItem('krishimitra_user')
    try {
      await api.post('/auth/logout')
    } catch (e) { /* silent */ }
  },

  async getProfile() {
    return await api.get('/auth/me')
  },

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token, password) {
    return await api.post('/auth/reset-password', { token, password })
  },

  async verifyOtp(otp, userId) {
    return await api.post('/auth/verify-otp', { otp, userId })
  },

  async resendOtp(userId) {
    return await api.post('/auth/resend-otp', { userId })
  },

  async changePassword(currentPassword, newPassword) {
    return await api.put('/auth/change-password', { currentPassword, newPassword })
  },

  async updateProfile(data) {
    return await api.put('/auth/profile', data)
  },

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post('/auth/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default authService
