<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted } from 'vue';
import TickIcon from './icons/TickIcon.vue';
import RefreshIcon from './icons/RefreshIcon.vue';
import CheckCircleIcon from './icons/CheckCircleIcon.vue';
import PhoneIncomingIconVue from './icons/PhoneIncomingIcon.vue';
import PhoneOutgoingIconVue from './icons/PhoneOutgoingIcon.vue';
import { useChatStore } from '@/stores/chat';

const chat = useChatStore()
const auth = useAuthStore()
const props = defineProps<{ message: Message, friendId: ID }>()
const isRight = computed(() => props.message.senderId === auth.user.id)
const isRead = computed(() => props.message.status === 'READ')
const isPending = computed(() => props.message.status === 'PENDING')
const isSent = computed(() => props.message.status === 'SENT')
const class_ = computed(() => isRight.value ? 'right' : 'left')

function formatTime(str: string) {
  const date = new Date(str)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  if (!isRead.value && !isRight.value) {
    chat.read(props.friendId, props.message.id)
  }
})

</script>

<template>
  <article v-if="message.type === 'TEXT'" class="row flex message-item" :class="class_">
    <TickIcon v-if="isRight && isSent" />
    <p :class="isRight ? 'sent-message' : 'received-message'">{{ message.message }}</p>
    <RefreshIcon v-if="isRight && isPending" />
    <span>{{ formatTime(message.createdAt) }}</span>
  </article>
  <article v-else-if="message.type === 'VIDEO-CALL'" class="row flex message-item" :class="class_">
    <p v-if="message.status === 'READ'">
      <PhoneIncomingIconVue />
      <PhoneOutgoingIconVue />
    </p>
  </article>
  <article v-else-if="message.type === 'VOICE-CALL'" class="row flex message-item" :class="class_">
    <p v-if="message.status === 'READ'">
      <PhoneIncomingIconVue />
      <PhoneOutgoingIconVue />
    </p>
  </article>
  <article v-else class="request center row">
    <CheckCircleIcon />
    <p>Message request accepted</p>
    <span>{{ formatTime(message.createdAt) }}</span>
  </article>
</template>

<style scoped>
.message-item {
  padding: .5em;
  gap: .4em;
  align-items: flex-end;
}

.request {
  font-size: 12px;
  gap: .5em;
  align-items: flex-end;
  margin-bottom: 4em;
}

.request>p {
  border-radius: 2em;
}

p {
  background: var(--bg-black-2);
  padding: .5em;
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

article>section {
  gap: .5em;
}

span {
  font-size: 10px;
}
</style>