<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import IconButton from './IconButton.vue';
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
      <NavIcon to="/requests">
        <SettingIcon class="icon" />
      </NavIcon>
    </section>
   <IconButton @click="auth.signOut">
    <LogOutIcon />
   </IconButton>
  </nav>
</template>

<style scoped>

nav {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-bottom: 1em;
  width: 48px;
}

nav>section {
  display: flex;
  flex-direction: column;
  row-gap: .5em;
}</style>