<script setup lang="ts">
import { socket } from '@/socket';
import { defaults } from 'mande';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import CallModal from './components/CallModal.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { useCallStore } from './stores/call';
import { useChatStore } from './stores/chat';

const chatStore = useChatStore()
const authStore = useAuthStore()
const callStore = useCallStore()
const { token } = storeToRefs(authStore)

socket.off()

watch(token, (newToken) => {
  if (newToken) {
    socket.auth = {
      token: authStore.token
    }
    defaults.headers.Authorization = `Bearer ${authStore.token}`
    chatStore.start()
    callStore.bindEvents()
    socket.connect()
  } else {
    router.replace('/auth')
  }
}, {
  immediate: true
})

</script>

<template>
  <RouterView />
  <CallModal />
</template>