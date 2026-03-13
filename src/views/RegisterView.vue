<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerApi } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const errorText = ref('')
const successText = ref('')

const form = reactive({
  nickname: '',
  username: '',
  password: ''
})

async function handleRegister() {
  errorText.value = ''
  successText.value = ''

  if (!form.nickname || !form.username || !form.password) {
    errorText.value = '请完整填写昵称、用户名和密码'
    return
  }

  loading.value = true
  try {
    await registerApi(form)
    successText.value = '注册成功，正在跳转登录页...'
    setTimeout(() => {
      router.push('/login')
    }, 600)
  } catch (error) {
    errorText.value = error?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page page-shell">
    <div class="card auth-card">
      <h1 class="auth-title">创建账号</h1>
      <p class="auth-subtitle">加入轻量聊天系统，和伙伴保持实时沟通</p>

      <div class="form-item">
        <label class="form-label">昵称</label>
        <input v-model.trim="form.nickname" class="input" placeholder="例如：小明" />
      </div>

      <div class="form-item">
        <label class="form-label">用户名</label>
        <input v-model.trim="form.username" class="input" placeholder="3~64 位" />
      </div>

      <div class="form-item">
        <label class="form-label">密码</label>
        <input
          v-model.trim="form.password"
          class="input"
          type="password"
          placeholder="6~32 位"
          @keyup.enter="handleRegister"
        />
      </div>

      <button class="btn btn-primary" style="width: 100%" :disabled="loading" @click="handleRegister">
        {{ loading ? '注册中...' : '注册账号' }}
      </button>

      <div v-if="errorText" class="form-error">{{ errorText }}</div>
      <div v-if="successText" class="form-success">{{ successText }}</div>

      <div class="auth-switch">
        已有账号？
        <RouterLink to="/login" class="link">立即登录</RouterLink>
      </div>
    </div>
  </div>
</template>
