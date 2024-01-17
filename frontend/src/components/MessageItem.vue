<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import TickIcon from './icons/TickIcon.vue'
import RefreshIcon from './icons/RefreshIcon.vue'
import CheckCircleIcon from './icons/CheckCircleIcon.vue'
import PhoneIncomingIcon from './icons/PhoneIncomingIcon.vue'
import PhoneOutgoingIcon from './icons/PhoneOutgoingIcon.vue'
import PhoneMissedIcon from './icons/PhoneMissedIcon.vue'
import VideoOnIcon from './icons/VideoOnIcon.vue'
import PhoneIcon from './icons/PhoneIcon.vue'
import { useChatStore } from '@/stores/chat'
import { formatTime } from '@/util'
import { useCallStore } from '@/stores/call'

const chat = useChatStore()
const { start } = useCallStore()
const auth = useAuthStore()
const props = defineProps<{ message: Message; friendId: ID }>()
const isUserSender = computed(() => props.message.senderId === auth.user.id)
const isRead = computed(() => props.message.status === 'READ')
const isPending = computed(() => props.message.status === 'PENDING')
const isSent = computed(() => props.message.status === 'SENT')
const class_ = computed(() => (isUserSender.value ? 'right' : 'left'))

function startCall() {
  const friend = chat.entities[props.friendId]
  start(friend, props.message.type === 'VIDEO-CALL')
}

onMounted(() => {
  if (!isRead.value && !isUserSender.value && props.message.type === 'TEXT') {
    chat.read(props.friendId, props.message.id)
  }
})
</script>

<template>
  <article v-if="message.type === 'TEXT'" class="row flex message-item" :class="class_">
    <TickIcon v-if="isUserSender && isSent" />
    <p :class="isUserSender ? 'sent-message' : 'received-message'">{{ message.message }}</p>
    <RefreshIcon v-if="isUserSender && isPending" />
    <span>{{ formatTime(message.createdAt) }}</span>
  </article>
  <article
    v-else-if="message.type === 'VOICE-CALL' || message.type === 'VIDEO-CALL'"
    class="flex message-item"
    :class="class_"
  >
    <section
      :class="
        isRead
          ? isUserSender
            ? 'call-right'
            : 'call-left'
          : isUserSender
            ? 'missed-right'
            : 'missed-left'
      "
      class="call column"
    >
      <span class="row">
        <VideoOnIcon v-if="message.type === 'VIDEO-CALL'" />
        <PhoneIncomingIcon v-if="!isUserSender && isRead" />
        <PhoneOutgoingIcon v-if="isUserSender && isRead" />
        <PhoneMissedIcon v-if="isSent" />
        <PhoneIcon v-if="isPending" />
        {{
          isRead
            ? isUserSender
              ? 'Outgoing call'
              : 'Incoming call'
            : isPending
              ? 'Call Failed'
              : 'Missed call'
        }}
      </span>
      <span v-if="isRead">{{ message.message }}</span>
      <button @click="startCall" v-else class="action center">
        <PhoneIcon v-if="isPending" />{{ isUserSender ? 'Call again' : 'Call back' }}
      </button>
    </section>
    <span>{{ formatTime(message.createdAt) }}</span>
  </article>
  <article v-else class="request center row">
    <CheckCircleIcon />
    <p>Message request accepted</p>
    <span>{{ formatTime(message.createdAt) }}</span>
  </article>
</template>

<style scoped>
.call {
  padding: 0.5em;
  border-radius: var(--border-radius);
}

.call > button {
  background: rgba(255, 255, 255, 0.1);
}

.missed-left {
  background: rgb(54, 17, 17);
}

.call-right {
  background: var(--bg-green);
}

.call-left {
  background: var(--bg-black-2);
}

.call-right,
.call-left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.missed-right {
  background: var(--bg-green);
}

.missed.action {
  background-color: rgba(255, 255, 255, 0.1);
}

.message-item {
  padding: 0.5em;
  gap: 0.4em;
  align-items: flex-end;
}

.request {
  font-size: 12px;
  gap: 0.5em;
  align-items: flex-end;
  margin-bottom: 4em;
}

.request > p {
  border-radius: 2em;
}

p {
  background: var(--bg-black-2);
  padding: 0.5em;
  border-radius: var(--border-radius);
  word-wrap: break-word;
  word-break: break-all;
}

.right {
  flex-direction: row-reverse;
}

.sent-message {
  background: var(--bg-green);
}

article > section {
  gap: 0.5em;
}

span {
  font-size: 10px;
}
</style>
