<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const { width } = useWindowSize()
const isSmallScreen = computed(() => width.value < 576)
</script>
<template>
  <ChatList v-if="isSmallScreen" />
  <div v-else class="flex column center main-section">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <p>Chat with your friends and loved ones</p>
  </div>
</template>
<style scoped>
.center {
  align-items: center;
  padding: 1em;
}

p {
  text-align: center;
}
</style>
