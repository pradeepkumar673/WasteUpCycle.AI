import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const wasteAPI = {
  analyze: (wasteData) => API.post('/waste/analyze', wasteData),
  getHistory: () => API.get('/waste/history'),
}

export default API