import API from './api'

export const authAPI = {
  login: (email, password) => 
    API.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData) => 
    API.post('/auth/register', userData).then(res => res.data),
  
  getProfile: () => 
    API.get('/auth/profile').then(res => res.data),
}