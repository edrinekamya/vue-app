<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import PhoneIcon from '@/components/icons/PhoneIcon.vue'
import SendIcon from '@/components/icons/SendIcon.vue'
import VideoOnIcon from '@/components/icons/VideoOnIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { useCallStore } from '@/stores/call'
import { useChatStore } from '@/stores/chat'
import { useGlobalStore } from '@/stores/global'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useChatStore()
const route = useRoute()
const text = ref('')
const auth = useAuthStore()
const callStore = useCallStore()
const router = useRouter()
const state = useGlobalStore()

const friend = computed(() => store.entities[parseInt(route.params.id as string)])
const messages = computed<Message[]>(() => Object.values(friend.value.messages))
const request = computed(() => messages.value[0])

const isRequestAccepted = computed(() => request.value.status === 'READ')
const isRequestPending = computed(() => request.value.status === 'PENDING')
const isUserSender = computed(() => request.value.senderId === auth.user.id)

const bottom = ref<HTMLElement | null>(null)

watch(
  friend,
  (newFriend) => {
    if (!newFriend) {
      state.deletePath(route.fullPath)
      router.push(`/`)
    }
  },
  {
    immediate: true
  }
)

function sendText() {
  if (text.value) {
    store.send({ message: text.value, type: 'TEXT' }, friend.value.id)
    text.value = ''
  }
}

onMounted(() => {
  bottom.value?.scrollIntoView({ behavior: 'instant' })
})

watch(
  messages,
  () => {
    nextTick(() => {
      bottom.value?.scrollIntoView({ behavior: 'smooth' })
    })
  },
  { immediate: true }
)

function resendRequest() {
  const { id, username, createdAt } = friend.value
  store.send(
    {
      type: 'REQUEST',
      message: `Message request`
    },
    id,
    { id, username, createdAt }
  )
}
</script>

<template>
  <section class="chat-view">
    <header class="row spaced">
      <h2>{{ friend.username }}</h2>
      <section v-show="isRequestAccepted" class="row">
        <button class="center" @click="callStore.start(friend, false)">
          <PhoneIcon />
        </button>
        <button class="center" @click="callStore.start(friend, true)">
          <VideoOnIcon />
        </button>
      </section>
    </header>
    <TransitionGroup name="list" v-if="isRequestAccepted">
      <section class="column message-list">
        <MessageItem
          :friend-id="friend.id"
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        <b ref="bottom"></b>
      </section>
    </TransitionGroup>
    <div v-else class="flex center">
      <section class="column">
        <h3>
          {{
            isUserSender
              ? isRequestPending
                ? 'Request not sent'
                : 'Request sent'
              : 'New message request'
          }}
        </h3>
        <p>
          {{
            isUserSender
              ? isRequestPending
                ? `Before resending please check your internet connection`
                : `To promote
          privacy, you can only chat with new people after they accept your message
          request`
              : `Accept the request and start chatting or ignore the request if you're not interested`
          }}
        </p>
        <section v-if="isRequestPending" class="center row">
          <button @click="resendRequest">Resend</button>
          <button class="danger" @click="store.delete(friend.id, true)">Cancel</button>
        </section>
        <button v-else-if="isUserSender" class="danger" @click="store.delete(friend.id)">
          Cancel Request
        </button>
        <section v-else class="center row">
          <button @click="store.read(friend.id, messages[0].id)">Accept</button>
          <button class="danger" @click="store.delete(friend.id)">Ignore</button>
        </section>
      </section>
    </div>
    <footer v-if="isRequestAccepted" class="row">
      <textarea class="flex" placeholder="Message..." v-model="text" type="text"></textarea>
      <button class="center">
        <SendIcon @click.prevent="sendText" />
      </button>
    </footer>
  </section>
</template>

<style scoped>
footer {
  column-gap: 0.5em;
}

footer > button {
  background: var(--bg-green);
}

textarea {
  background: transparent;
  border: none;
  outline: none;
  color: wheat;
}

button {
  border-radius: 999px;
}

.danger {
  background: red;
}

header,
footer,
.message-list {
  background-color: var(--bg-black-1);
  padding: 0.5em;
}

section > div {
  padding: 1em;
}

section.column {
  gap: 1em;
}

h3,
p {
  text-align: center;
}

section > h3 {
  text-transform: capitalize;
}

section > p {
  font-size: 12px;
}

form {
  column-gap: 2px;
}

input {
  flex: 1;
}

.message-list {
  flex: 1;
  row-gap: 0.5em;
  overflow: auto;
}

.chat-view {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  overflow: auto;
  row-gap: var(--section-gap);
}

h2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

section.row {
  column-gap: 1em;
}
</style>
