<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'
const { width } = useWindowSize()
const isSmallScreen = computed(() => width.value < 576)
</script>

<template>
  <section class="home">
    <ChatList v-if="!isSmallScreen" />
    <RouterView />
  </section>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
}

@media (min-width: 576px) {
  .home {
    display: grid;
    grid-template-columns: 40vw 1fr;
    grid-template-rows: 1fr;
    column-gap: var(--section-gap);
  }
}
</style>
