import axios from 'axios'
import { getToken, removeToken } from '../utils/token'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
})

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res?.code === 200 || res?.status === true) {
      return res
    }

    return Promise.reject(new Error(res?.message || '请求失败'))
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request