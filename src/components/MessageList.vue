<script setup>
import { nextTick, ref, watch } from 'vue'
import { getToken } from '../utils/token'
import { getFileExtension } from '../utils/file'
import { formatTime } from '../utils/time'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: [Number, String],
    default: ''
  }
})

const scrollRef = ref(null)
const downloadingId = ref('')

function getContent(item) {
  return item.content || item.text || ''
}

function getMessageType(item) {
  return String(item.messageType || item.type || 'TEXT').toUpperCase()
}

function isFileLikeMessage(item) {
  return ['FILE', 'IMAGE', 'VIDEO', 'AUDIO'].includes(getMessageType(item))
}

function getSenderName(item) {
  return item.senderNickname || item.senderName || item.senderUsername || '用户'
}

function getSenderId(item) {
  return item.senderId || item.fromUserId || item.userId
}

function isMine(item) {
  return String(getSenderId(item)) === String(props.currentUserId)
}

function getTime(item) {
  return formatTime(item.createTime || item.createdAt || item.sendTime || item.timestamp)
}

function getAttachment(item) {
  return item.attachment || {}
}

function getFileName(item) {
  const attachment = getAttachment(item)
  return (
    attachment.originalName ||
    attachment.fileName ||
    item.fileName ||
    item.originFileName ||
    item.originalName ||
    '未命名文件'
  )
}

function getMimeType(item) {
  const attachment = getAttachment(item)
  return attachment.mimeType || item.mimeType || ''
}

function getAttachmentId(item) {
  const attachment = getAttachment(item)
  return attachment.id || item.attachmentId || ''
}

function getFileUrl(item) {
  const attachment = getAttachment(item)
  return attachment.url || attachment.fileUrl || attachment.downloadUrl || item.fileUrl || item.url || ''
}

function getDownloadUrlByAttachmentId(item) {
  const attachmentId = getAttachmentId(item)
  if (!attachmentId) return ''

  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  const path = import.meta.env.VITE_ATTACHMENT_DOWNLOAD_PATH || '/api/file/download'
  const separator = path.includes('?') ? '&' : '?'
  return `${baseURL}${path}${separator}attachmentId=${attachmentId}`
}

function triggerBrowserDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

async function handleDownload(item) {
  const requestId = String(item.id || item.messageId || getAttachmentId(item) || '')
  downloadingId.value = requestId

  try {
    const directUrl = getFileUrl(item)
    const url = directUrl || getDownloadUrlByAttachmentId(item)

    if (!url) {
      window.alert('该文件暂无可下载地址，请让后端在消息中返回 fileUrl，或提供下载接口。')
      return
    }

    const token = getToken()
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    if (!response.ok) {
      throw new Error(`下载失败（HTTP ${response.status}）`)
    }

    const blob = await response.blob()
    triggerBrowserDownload(blob, getFileName(item))
  } catch (error) {
    window.alert(error?.message || '文件下载失败')
  } finally {
    downloadingId.value = ''
  }
}

watch(
  () => props.messages,
  async () => {
    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div ref="scrollRef" class="message-scroll panel-body">
    <div class="message-list">
      <div
        v-for="item in messages"
        :key="item.id || item.messageId || `${getSenderId(item)}-${item.createTime || item.createdAt}`"
        class="message-row"
        :class="isMine(item) ? 'mine' : 'other'"
      >
        <div>
          <div class="message-bubble">
            <template v-if="isFileLikeMessage(item)">
              <div class="file-card">
                <div class="file-icon">{{ getFileExtension(getFileName(item)).slice(0, 4) }}</div>
                <div class="file-detail">
                  <div class="file-name">{{ getFileName(item) }}</div>
                  <div class="file-type">{{ getMessageType(item) }} {{ getMimeType(item) }}</div>
                  <button
                    class="btn btn-light btn-download"
                    :disabled="downloadingId === String(item.id || item.messageId || getAttachmentId(item) || '')"
                    @click="handleDownload(item)"
                  >
                    {{
                      downloadingId === String(item.id || item.messageId || getAttachmentId(item) || '')
                        ? '下载中...'
                        : '下载文件'
                    }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              {{ getContent(item) }}
            </template>
          </div>

          <div class="message-meta" :style="{ textAlign: isMine(item) ? 'right' : 'left' }">
            {{ isMine(item) ? '我' : getSenderName(item) }} · {{ getTime(item) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
