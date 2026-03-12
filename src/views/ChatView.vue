<script setup>
  const res = await sendFileMessageApi(activeConversationId.value, file)
  if (res.data) {
    messages.value.push(normalizeMessage({
      ...res.data,
      messageType: 'FILE'
    }))
  } else {
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
        <div class="panel-header" style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 700">会话列表</div>
            <div style="font-size: 12px; color: var(--text-secondary)">
              {{ userStore.userInfo?.nickname || userStore.userInfo?.username || '当前用户' }}
            </div>
          </div>
          <button class="btn btn-light" @click="handleLogout">退出</button>
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
          <div style="font-weight: 700">{{ activeTitle }}</div>
          <button class="btn btn-light" @click="handleLogout">退出</button>
        </div>

        <div class="panel-header" style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
          <div>
            <div style="font-size: 18px; font-weight: 700">{{ activeTitle }}</div>
            <div style="font-size: 12px; color: var(--text-secondary)">
              {{ loading ? '加载中...' : `共 ${messages.length} 条消息` }}
            </div>
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