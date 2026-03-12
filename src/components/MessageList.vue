<script setup>
import { nextTick, ref, watch } from 'vue'
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

function getContent(item) {
  return item.content || item.text || ''
}

function getMessageType(item) {
  return String(item.messageType || item.type || 'TEXT').toUpperCase()
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
  return formatTime(item.createTime || item.sendTime || item.timestamp)
}

function getFileName(item) {
  return item.fileName || item.originFileName || '未命名文件'
}

function getFileUrl(item) {
  return item.fileUrl || item.url || ''
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
        :key="item.id || item.messageId || `${getSenderId(item)}-${item.createTime}`"
        class="message-row"
        :class="isMine(item) ? 'mine' : 'other'"
      >
        <div>
          <div class="message-bubble">
            <template v-if="getMessageType(item) === 'FILE' || getMessageType(item) === 'IMAGE'">
              <div class="file-card">
                <div class="file-icon">{{ getFileExtension(getFileName(item)).slice(0, 4) }}</div>
                <div>
                  <div class="file-name">{{ getFileName(item) }}</div>
                  <a v-if="getFileUrl(item)" :href="getFileUrl(item)" target="_blank" class="file-link">
                    点击查看 / 下载
                  </a>
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
