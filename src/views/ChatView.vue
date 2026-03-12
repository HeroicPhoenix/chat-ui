<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createConversationApi, getMyConversationsApi } from '../api/conversation'
import { getRecentMessagesApi, sendFileMessageApi, sendTextMessageApi } from '../api/message'
import ConversationList from '../components/ConversationList.vue'
import EmptyState from '../components/EmptyState.vue'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const conversations = ref([])
const messages = ref([])
const activeConversation = ref(null)
const loading = ref(false)
const submitting = ref(false)
const mobileShowSidebar = ref(false)
const createName = ref('')
const createMembers = ref('')
const createError = ref('')

const currentUserId = computed(() => userStore.userInfo?.id || '')
const activeConversationId = computed(
  () => activeConversation.value?.id || activeConversation.value?.conversationId || ''
)
const activeTitle = computed(() => {
  if (!activeConversation.value) return '请选择会话'
  return activeConversation.value.name || activeConversation.value.title || `会话 ${activeConversationId.value}`
})

function parseMemberIds(raw) {
  if (!raw.trim()) return []
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)
}

function normalizeMessage(item) {
  return {
    ...item,
    senderId: item.senderId || item.fromUserId || item.userId,
    content: item.content || item.text || ''
  }
}

async function loadConversations() {
  loading.value = true
  try {
    const res = await getMyConversationsApi()
    conversations.value = res.data || []

    if (!activeConversation.value && conversations.value.length) {
      await selectConversation(conversations.value[0])
    }
  } finally {
    loading.value = false
  }
}

async function selectConversation(item) {
  activeConversation.value = item
  mobileShowSidebar.value = false

  const id = item?.id || item?.conversationId
  if (!id) {
    messages.value = []
    return
  }

  loading.value = true
  try {
    const res = await getRecentMessagesApi({
      conversationId: id,
      limit: 50
    })
    messages.value = (res.data || []).map(normalizeMessage)
  } finally {
    loading.value = false
  }
}

async function handleCreateConversation() {
  createError.value = ''
  submitting.value = true

  try {
    const payload = {
      name: createName.value.trim() || undefined,
      memberIds: parseMemberIds(createMembers.value)
    }

    const res = await createConversationApi(payload)
    const created = res.data
    if (!created) {
      await loadConversations()
      return
    }

    createName.value = ''
    createMembers.value = ''
    await loadConversations()
    await selectConversation(created)
  } catch (error) {
    createError.value = error?.message || '创建会话失败'
  } finally {
    submitting.value = false
  }
}

async function handleSendText(content) {
  if (!activeConversationId.value) return

  const res = await sendTextMessageApi({
    conversationId: activeConversationId.value,
    content
  })

  if (res.data) {
    messages.value.push(normalizeMessage(res.data))
  } else if (activeConversation.value) {
    await selectConversation(activeConversation.value)
  }
}

async function handleSendFile(file) {
  if (!activeConversationId.value) return

  const res = await sendFileMessageApi(activeConversationId.value, file)
  if (res.data) {
    messages.value.push(
      normalizeMessage({
        ...res.data,
        messageType: 'FILE'
      })
    )
  } else if (activeConversation.value) {
    await selectConversation(activeConversation.value)
  }
}

async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchMe()
  }
  await loadConversations()
})
</script>

<template>
  <div class="page-shell">
    <div class="chat-layout">
      <aside class="card sidebar" :class="{ 'mobile-show': mobileShowSidebar }">
        <div class="panel-header top-space-between">
          <div>
            <div class="panel-title">会话列表</div>
            <div class="panel-subtitle">
              {{ userStore.userInfo?.nickname || userStore.userInfo?.username || '当前用户' }}
            </div>
          </div>
          <button class="btn btn-light" @click="handleLogout">退出</button>
        </div>

        <div class="create-panel">
          <input v-model.trim="createName" class="input" placeholder="会话名称（可选）" />
          <input v-model.trim="createMembers" class="input" placeholder="成员ID，多个用逗号分隔" />
          <button class="btn btn-primary" :disabled="submitting" @click="handleCreateConversation">
            {{ submitting ? '创建中...' : '新建会话' }}
          </button>
          <div v-if="createError" class="form-error">{{ createError }}</div>
        </div>

        <ConversationList
          :conversations="conversations"
          :active-conversation-id="activeConversationId"
          @select="selectConversation"
        />
      </aside>

      <main class="card main-panel">
        <div class="mobile-topbar">
          <button class="btn btn-light" @click="mobileShowSidebar = true">会话</button>
          <div class="mobile-title">{{ activeTitle }}</div>
          <button class="btn btn-light" @click="handleLogout">退出</button>
        </div>

        <div class="panel-header top-space-between">
          <div>
            <div class="panel-title">{{ activeTitle }}</div>
            <div class="panel-subtitle">{{ loading ? '加载中...' : `共 ${messages.length} 条消息` }}</div>
          </div>
        </div>

        <template v-if="activeConversation">
          <MessageList :messages="messages" :current-user-id="currentUserId" />
          <MessageInput @send-text="handleSendText" @send-file="handleSendFile" />
        </template>

        <template v-else>
          <EmptyState />
        </template>
      </main>
    </div>
  </div>
</template>
