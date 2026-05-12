import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Axios instance — attaches token to every request automatically
const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
  getMe:  ()     => api.get('/auth/me'),
}

// Scripts
export const scriptAPI = {
  generate:  (data) => api.post('/scripts/generate', data),
  getAll:    ()     => api.get('/scripts'),
  getById:   (id)   => api.get(`/scripts/${id}`),
  update:    (id, data) => api.put(`/scripts/${id}`, data),
  duplicate: (id)   => api.post(`/scripts/${id}/duplicate`),
  delete:    (id)   => api.delete(`/scripts/${id}`),
}

// Folders
export const folderAPI = {
  create: (data) => api.post('/folders', data),
  getAll: ()     => api.get('/folders'),
  delete: (id)   => api.delete(`/folders/${id}`),
}

export default api