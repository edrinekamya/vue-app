import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGlobalStore = defineStore('navigation', {
  state: () => ({
    navigation: {} as any,
    isNotificationOpen: false,
    queue: [] as string[],
    isSearchOpen: false,
    deletedPaths: {} as any
  }),
  getters: {
    slot: (state) => state.queue[0]
  },
  actions: {
    deletePath(path: string) {
      this.deletedPaths[path] = true
    },
    persistNavigation(key: string, route: string) {
      if (!this.deletedPaths[route]) {
        this.navigation[key] = route
      }
    },
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen
    },

    openNotification() {
      this.isNotificationOpen = true
    },

    closeNotification() {
      this.isNotificationOpen = false
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
}
