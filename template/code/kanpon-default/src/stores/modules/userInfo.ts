import { defineStore } from 'pinia'
import { login } from '@/service/login'

export const useUserInfoStore = defineStore({
  id: 'userInfo',
  state: () => {
    return {
      userInfo: {
        token: '',
        tokenType: ''
      }
    }
  },
  getters: {
    authorization(): string {
      return this.userInfo.tokenType + ' ' + this.userInfo.token
    }
  },
  actions: {
    // 登录
    async login(form: { username: string; password: string }) {
      const { access_token = '', token_type = '' } = await login(form.username, form.password)
      if (access_token && token_type) {
        this.userInfo.token = access_token
        this.userInfo.tokenType = token_type
      }
    }
  }
})
