<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import NavIcon from './NavIcon.vue';
import ChatIconVue from './icons/ChatIcon.vue';
import LogOutIcon from './icons/LogOutIcon.vue';
import SettingIcon from './icons/SettingIcon.vue';

const auth = useAuthStore()
</script>

<template>
  <nav>
    <section>
      <NavIcon to="/">
        <ChatIconVue />
      </NavIcon>
      <NavIcon to="/settings">
        <SettingIcon />
      </NavIcon>
    </section>
    <button class="icon" @click="auth.signOut">
      <LogOutIcon />
    </button>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-bottom: .5em;
}

nav>section {
  display: flex;
  flex-direction: column;
  row-gap: .5em;
}
</style>