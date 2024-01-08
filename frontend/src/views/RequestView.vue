<script setup lang="ts">
import { ref } from 'vue';

const tab = ref<'sent' | 'incoming'>('sent')
</script>

<template>
  <div class="flex main-section">
    <header class="row">
      <h1>Chats</h1>
      <section class="row">
        <button>Incoming</button>
        <button>Sent</button>
      </section>
    </header>
  </div>
</template>
<style scoped></style>