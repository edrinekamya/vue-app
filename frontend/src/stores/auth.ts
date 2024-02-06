import router from '@/router'
import { useSessionStorage } from '@vueuse/core'
import { mande } from 'mande'
import { acceptHMRUpdate, defineStore } from 'pinia'

const auth = mande(`/api/auth`)

export interface Credential {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    credentials: useSessionStorage('pinia/auth/credential', {} as Credential),
    isLoading: true,
    errorMessage: ''
  }),
  getters: {
    user: (state) => state.credentials.user,
    token: (state) => state.credentials.token
  },
  actions: {
    async authenticate(fn: Function) {
      this.isLoading = true
      this.errorMessage = ''
      try {
        await fn()
      } catch (error: any) {
        this.errorMessage = error.body?.error ?? error.message ?? 'Something unexpected happened'
      }
      this.isLoading = false
    },
    async signIn(username: string, password: string) {
      this.authenticate(async () => {
        const data = await auth.post<Credential>(`/sign-in`, {
          username,
          password
        })
        this.credentials = data
        router.replace('/')
      })
    },
    async signUp(username: string, password: string) {
      this.authenticate(async () => {
        await auth.post(`/sign-up`, {
          username,
          password
        })
        router.push(`/auth/sign-in`)
      })
    },

    signOut() {
      this.credentials = {
        user: {},
        token: ''
      } as Credential
      this.$reset()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
