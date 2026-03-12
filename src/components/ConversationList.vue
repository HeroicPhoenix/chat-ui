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

function getMemberCount(item) {
  return item.memberCount || item.members?.length || 0
}
</script>

<template>
  <div class="conversation-scroll">
    <div
      v-for="item in conversations"
      :key="getId(item)"
      class="conversation-item"
      :class="{ active: String(activeConversationId) === String(getId(item)) }"
      @click="emit('select', item)"
    >
      <div class="conversation-name">{{ getTitle(item) }}</div>
      <div class="conversation-meta">
        <span>ID: {{ getId(item) }}</span>
        <span>成员 {{ getMemberCount(item) }}</span>
      </div>
    </div>
  </div>
</template>
