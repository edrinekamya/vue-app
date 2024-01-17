<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { useGlobalStore } from '@/stores/global'
import { ref, watchEffect } from 'vue'
import ModalOverlay from './ModalOverlay.vue'
import { mande } from 'mande'

const api = mande('/api/users')

const store = useGlobalStore()
const chat = useChatStore()
const query = ref('')
const results = ref<User[]>([])
const isFetching = ref(false)

watchEffect(async () => {
  const key = encodeURIComponent(query.value)
  if (key.length) {
    isFetching.value = true
    results.value = await api.get<User[]>(`/${key}`)
    isFetching.value = false
  }
})

const isLoading = ref(false)

function sendRequest(user: User, index: number) {
  isLoading.value = true
  chat.send(
    {
      type: 'REQUEST',
      message: `Message request`
    },
    user.id,
    user
  )
  results.value.splice(index, 1)
  isLoading.value = false
}
</script>

<template>
  <ModalOverlay @close="store.toggleSearch" :is-open="store.isSearchOpen">
    <div @click.stop="null" class="search-modal column">
      <section class="column">
        <h2>Find friends</h2>
        <input
          :disabled="isLoading"
          class="search-bar"
          placeholder="Search for new friends"
          v-model="query"
          type="text"
        />
      </section>
      <TransitionGroup name="list">
        <article class="row spaced" v-for="(user, i) in results" :key="user.id">
          <p>{{ user.username }}</p>
          <button @click="sendRequest(user, i)">Add Friend</button>
        </article>
      </TransitionGroup>
    </div>
  </ModalOverlay>
</template>

<style scoped>
.search-modal {
  margin: 2em;
  padding: 1em;
  gap: 1em;
  background: var(--bg-black-2);
  border-radius: 0.5em;
  width: 60vh;
  align-self: flex-start;
}

input {
  background: var(--bg-black-1);
}

article {
  padding: 1em;
  border-radius: var(--border-radius);
}

article > button {
  display: none;
  background: limegreen;
  border: none;
  color: white;
  padding: 0.5em 1em;
  border-radius: var(--border-radius);
}

p {
  text-transform: capitalize;
}

article:hover {
  background: var(--bg-black-3);
}

article:hover > button {
  display: inline;
}
</style>
