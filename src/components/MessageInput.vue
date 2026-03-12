<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send-text', 'send-file'])
const text = ref('')
const fileRef = ref(null)
const sending = ref(false)

async function handleSend() {
  const value = text.value.trim()
  if (!value || sending.value) return

  sending.value = true
  try {
    await emit('send-text', value)
    text.value = ''
  } finally {
    sending.value = false
  }
}

async function handleChooseFile(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    await emit('send-file', file)
  } finally {
    event.target.value = ''
  }
}
</script>

<template>
  <div class="message-input-wrap">
    <textarea
      v-model="text"
      class="textarea"
      rows="3"
      placeholder="输入消息，Enter 发送，Shift + Enter 换行"
      @keydown.enter.exact.prevent="handleSend"
    />

    <div class="message-toolbar">
      <input ref="fileRef" type="file" hidden @change="handleChooseFile" />
      <button class="btn btn-light" @click="fileRef?.click()">发送文件</button>

      <button class="btn btn-primary" @click="handleSend">
        {{ sending ? '发送中...' : '发送消息' }}
      </button>
    </div>
  </div>
</template>
