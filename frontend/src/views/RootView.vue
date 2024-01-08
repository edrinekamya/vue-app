<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import SideBar from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()
</script>

<template>
  <div class="root">
    <header class="row">
      <AppLogo size="24" />
      <h1>{{ auth.user.username }}</h1>
    </header>
    <SideBar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2em;
  text-transform: capitalize;
}

main {
  border-top-left-radius: .5em;
  display: flex;
  overflow: auto;
}

.root {
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  gap: .5em;
  padding: .5em 0 0 .5em;
}

.root>header {
  grid-column: span 2;
  column-gap: .5em;
}
</style>