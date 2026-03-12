import request from './request'

export function getRecentMessagesApi(params) {
  return request.get('/api/message/recent', { params })
}

export function sendTextMessageApi(data) {
  return request.post('/api/message/text/send', data)
}

export function sendFileMessageApi(conversationId, file) {
  const formData = new FormData()
  formData.append('conversationId', conversationId)
  formData.append('file', file)

  return request.post('/api/message/file/send', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}