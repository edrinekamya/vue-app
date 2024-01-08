<script setup lang="ts">
import ChatList from '@/components/ChatList.vue';
</script>

<template>
  <section class="home">
    <ChatList />
    <RouterView />
  </section>
</template>

<style scoped>
.home {
  flex: 1;
  display: grid;
  grid-template-columns: 40vw 1fr;
  grid-template-rows: 1fr;
  column-gap: var(--section-gap);
}
</style>
