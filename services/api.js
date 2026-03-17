import axios from 'axios'

// En producción usa VITE_API_URL, en desarrollo usa el proxy de Vite (/api)
const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + '/api'
  : '/api'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Adjunta JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normaliza errores
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Error desconocido'
    return Promise.reject(new Error(message))
  }
)

export const accountsApi = {
  list: (params = {}) => api.get('/accounts', { params }).then(r => r.data),
  get: (id) => api.get(`/accounts/${id}`).then(r => r.data),
  create: (payload) => api.post('/accounts', payload).then(r => r.data),
  update: (id, payload) => api.patch(`/accounts/${id}`, payload).then(r => r.data),
  delete: (id) => api.delete(`/accounts/${id}`).then(r => r.data),
  sendCredentials: (id) => api.post(`/accounts/${id}/send-credentials`).then(r => r.data),
  expiring: (days = 3) => api.get('/accounts/expiring', { params: { days } }).then(r => r.data),
}

export const customersApi = {
  list: (params = {}) => api.get('/customers', { params }).then(r => r.data),
  get: (id) => api.get(`/customers/${id}`).then(r => r.data),
  create: (payload) => api.post('/customers', payload).then(r => r.data),
  update: (id, payload) => api.patch(`/customers/${id}`, payload).then(r => r.data),
  deactivate: (id) => api.delete(`/customers/${id}`).then(r => r.data),
  getSales: (id) => api.get(`/customers/${id}/sales`).then(r => r.data),
  createSale: (id, payload) => api.post(`/customers/${id}/sales`, payload).then(r => r.data),
  sendReminder: (id) => api.post(`/customers/${id}/send-reminder`).then(r => r.data),
}

export const platformsApi = {
  list: () => api.get('/platforms').then(r => r.data),
}

export const authApi = {
  login: (password) => api.post('/auth/login', { password }).then(r => r.data),
}

export default api
