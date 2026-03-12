import { defineStore } from 'pinia'
import { loginApi, logoutApi, meApi } from '../api/auth'
import { getToken, removeToken, setToken } from '../utils/token'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: null
  }),

  getters: {
    isLogin: (state) => !!state.token
  },

  actions: {
    async login(form) {
      const res = await loginApi(form)
      const token = res?.data?.token || res?.data?.accessToken || ''
      if (!token) {
        throw new Error('登录成功，但未获取到 token，请确认 LoginVO 字段名')
      }
      this.token = token
      setToken(token)
      await this.fetchMe()
      return res
    },

    async fetchMe() {
      const res = await meApi()
      this.userInfo = res.data
      return res.data
    },

    async logout() {
      try {
        await logoutApi()
      } finally {
        this.clearLogin()
      }
    },

    clearLogin() {
      this.token = ''
      this.userInfo = null
      removeToken()
    }
  }
})