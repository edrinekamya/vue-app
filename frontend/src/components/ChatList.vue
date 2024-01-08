<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import ChatItem from './ChatItem.vue';
import { useGlobalStore } from '@/stores/global';
import SearchModal from './SearchModal.vue';
import NewIcon from './icons/NewIcon.vue';
import IconButton from './IconButton.vue';

const chat = useChatStore()
const store = useGlobalStore()

</script>

<template>
  <section class="chat-list">
    <header class="column">
      <section class="row">
        <h2>Chats</h2>
        <IconButton @click="store.toggleSearch">
          <NewIcon />
        </IconButton>
      </section>
      <input :disabled="!chat.chats.length" class="search-bar" placeholder="Search chats" type="text">
    </header>
    <nav class="column">
      <ChatItem v-for="item in chat.chats" :chat="item" :key="item.id" />
    </nav>
    <SearchModal />
  </section>
</template>

<style scoped>
.btn {
  gap: 1em;
}

header {
  padding: 1em;
  gap: .5em;
}

.chat-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  background-color: var(--bg-black-1);
}

header>section {
  justify-content: space-between;
}

nav {
  overflow: auto;
  gap: .5em;
  padding: 0 .5em;
}
</style>