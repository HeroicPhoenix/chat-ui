import request from './request'

export function registerApi(data) {
  return request.post('/api/auth/register', data)
}

export function loginApi(data) {
  return request.post('/api/auth/login', data)
}

export function logoutApi() {
  return request.post('/api/auth/logout')
}

export function meApi() {
  return request.get('/api/auth/me')
}