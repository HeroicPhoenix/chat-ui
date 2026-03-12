<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const errorText = ref('')

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  errorText.value = ''
  if (!form.username || !form.password) {
    errorText.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  try {
    await userStore.login(form)
    router.push('/chat')
  } catch (error) {
    errorText.value = error?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page page-shell">
    <div class="card auth-card">
      <h1 class="auth-title">欢迎回来</h1>
      <p class="auth-subtitle">登录你的聊天系统，继续和好友交流</p>

      <div class="form-item">
        <label class="form-label">用户名</label>
        <input v-model.trim="form.username" class="input" placeholder="请输入用户名" />
      </div>

      <div class="form-item">
        <label class="form-label">密码</label>
        <input
          v-model.trim="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
      </div>

      <button class="btn btn-primary" style="width: 100%" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div v-if="errorText" class="form-error">{{ errorText }}</div>

      <div style="margin-top: 18px; color: var(--text-secondary); font-size: 14px">
        还没有账号？
        <RouterLink to="/register" style="color: var(--primary); font-weight: 600">立即注册</RouterLink>
      </div>
    </div>
  </div>
</template>