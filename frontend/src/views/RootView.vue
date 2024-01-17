<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import NavIcon from '@/components/NavIcon.vue'
import ChatIcon from '@/components/icons/ChatIcon.vue'
import SettingIcon from '@/components/icons/SettingIcon.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="root">
    <header class="row spaced">
      <section class="row">
        <AppLogo size="24" />
        <h1>{{ auth.user.username }}</h1>
      </section>
      <button class="icon" @click="auth.signOut">Logout</button>
    </header>
    <main>
      <RouterView />
    </main>
    <nav>
      <NavIcon name="Chats" to="/">
        <ChatIcon />
      </NavIcon>
      <NavIcon name="Settings" to="/settings">
        <SettingIcon />
      </NavIcon>
    </nav>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2em;
  text-transform: capitalize;
}

header {
  padding: 0 0.5em;
}

header > button {
  border-radius: 99px;
}

.root {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 0.5em;
  padding: 0.5em 0 0.5em 0;
}

nav {
  grid-row: 3;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

main {
  border-top-left-radius: 0.5em;
  display: flex;
  overflow: auto;
}

header > section {
  column-gap: 0.5em;
}

@media (min-width: 576px) {
  .root {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    padding: 0.5em 0 0 0.5em;
  }

  nav {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: flex-start;
  }

  .root > header {
    grid-column: span 2;
  }
}
</style>
