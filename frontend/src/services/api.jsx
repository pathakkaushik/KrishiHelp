import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishimitra_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      localStorage.removeItem('krishimitra_token')
      localStorage.removeItem('krishimitra_user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } else if (response?.status === 404) {
      toast.error('Resource not found.')
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api
