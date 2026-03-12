import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────
export const login       = (u, p)  => api.post('/auth/login', {username:u, password:p})
export const register    = (u,e,p) => api.post('/auth/register', {username:u,email:e,password:p})
export const getMe       = ()      => api.get('/auth/me')

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboard = (fy='2025-26') => api.get('/dashboard', {params:{fy}})

// ── Salary ────────────────────────────────────────────────────────────────
export const getSalarySlips   = (fy) => api.get('/salary/slips', {params:{fy}})
export const saveSalarySlip   = (d)  => api.post('/salary/slips', d)
export const deleteSalarySlip = (id) => api.delete(`/salary/slips/${id}`)
export const getSalarySummary = (fy) => api.get('/salary/summary', {params:{fy}})

// ── Tax ───────────────────────────────────────────────────────────────────
export const computeTax     = (body) => api.post('/tax/compute', body)
export const getTaxDed      = (fy)   => api.get('/tax/deductions', {params:{fy}})
export const saveTaxDed     = (d)    => api.post('/tax/deductions', d)

// ── FD ────────────────────────────────────────────────────────────────────
export const getAllFD     = ()    => api.get('/fd')
export const getActiveFD = ()    => api.get('/fd/active')
export const getFDSummary = ()   => api.get('/fd/summary')
export const createFD    = (d)   => api.post('/fd', d)
export const updateFD    = (id,d)=> api.put(`/fd/${id}`, d)
export const deleteFD    = (id)  => api.delete(`/fd/${id}`)

// ── SGB ───────────────────────────────────────────────────────────────────
export const getAllSGB    = ()     => api.get('/sgb')
export const getSGBSum   = ()     => api.get('/sgb/summary')
export const createSGB   = (d)    => api.post('/sgb', d)
export const updateSGBPrice = (id,price) => api.patch(`/sgb/${id}/price`, {currentPrice:price})
export const deleteSGB   = (id)   => api.delete(`/sgb/${id}`)

// ── MF ────────────────────────────────────────────────────────────────────
export const getAllMF    = ()   => api.get('/mf')
export const getMFSum   = ()   => api.get('/mf/summary')
export const createMF   = (d)  => api.post('/mf', d)
export const updateMF   = (id,d)=> api.put(`/mf/${id}`, d)
export const deleteMF   = (id) => api.delete(`/mf/${id}`)

// ── Home Loan ─────────────────────────────────────────────────────────────
export const getHomeLoan  = ()  => api.get('/home-loan')
export const saveHomeLoan = (d) => api.post('/home-loan', d)

export default api
