import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return '/login'
  }

  if (userStore.isLogin && !userStore.userInfo && to.path !== '/login') {
    try {
      await userStore.fetchMe()
    } catch (error) {
      userStore.clearLogin()
      return '/login'
    }
  }

  if (userStore.isLogin && (to.path === '/login' || to.path === '/register')) {
    return '/chat'
  }
})

export default router