<script setup>
defineProps({
  conversations: {
    type: Array,
    default: () => []
  },
  activeConversationId: {
    type: [Number, String],
    default: ''
  }
})

const emit = defineEmits(['select'])

function getTitle(item) {
  return item.name || item.title || `会话 ${item.id || item.conversationId}`
}

function getId(item) {
  return item.id || item.conversationId
}
</script>

<template>
  <div class="conversation-scroll" style="padding: 12px; flex: 1">
    <div
      v-for="item in conversations"
      :key="getId(item)"
      class="conversation-item"
      :class="{ active: String(activeConversationId) === String(getId(item)) }"
      @click="emit('select', item)"
    >
      <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px">{{ getTitle(item) }}</div>
      <div style="font-size: 12px; color: var(--text-secondary)">
        ID：{{ getId(item) }}
      </div>
    </div>
  </div>
</template>