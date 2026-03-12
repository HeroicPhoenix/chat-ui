import request from './request'

export function getMyConversationsApi() {
  return request.get('/api/conversation/my')
}

export function createConversationApi(data) {
  return request.post('/api/conversation/create', data)
}