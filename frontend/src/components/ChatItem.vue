<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useTimeAgo } from '@vueuse/core';
import { computed } from 'vue';
import NewIcon from './icons/NewIcon.vue';
import CheckCircleIcon from './icons/CheckCircleIcon.vue';
import PhoneIncomingIcon from './icons/PhoneIncomingIcon.vue';
import PhoneOutgoingIcon from './icons/PhoneOutgoingIcon.vue';
import PhoneMissedIcon from './icons/PhoneMissedIcon.vue';
import VideoOnIcon from './icons/VideoOnIcon.vue';
import PhoneIcon from './icons/PhoneIcon.vue';

const props = defineProps<{
  chat: Chat
}>()

const auth = useAuthStore()
const messages = computed<Message[]>(() => Object.values(props.chat.messages))
const message = computed(() => messages.value[messages.value.length - 1])
const timeAgo = useTimeAgo(() => message.value.createdAt)
const isUserSender = computed(() => message.value.senderId === auth.user.id)
const isRead = computed(() => message.value.status === 'READ')
const isPending = computed(() => message.value.status === 'PENDING')
const isSent = computed(() => message.value.status === 'SENT')

</script>
<template>
  <RouterLink class="no-underline" active-class="active-link" :to="`/chat/${chat.id}`">
    <h4 class="name">{{ chat.username }}</h4>
    <span>{{ timeAgo }}</span>
    <p v-if="message.type === 'TEXT'" class="message">
      <span v-if="isUserSender">
        {{ message.status }}
      </span>
      {{ message.message }}
    </p>
    <p v-else-if="message.type === 'REQUEST' && isUserSender">
      <NewIcon v-if="message.status === 'SENT'" />
      <CheckCircleIcon v-if="message.status === 'READ'" />
      {{ message.status === 'PENDING' ? 'Pending message request' : message.status === 'SENT' ? 'Message request sent' :
        'Message request accepted' }}
    </p>
    <p v-else-if="message.type === 'REQUEST' && !isUserSender">
      <NewIcon v-if="message.status === 'SENT'" />
      <CheckCircleIcon v-if="message.status === 'READ'" />
      {{ message.status === 'SENT' ? 'New message request' :
        'Message request accepted' }}
    </p>
    <p v-else>
      <VideoOnIcon v-if="message.type === 'VIDEO-CALL'" />
      <PhoneIncomingIcon v-if="!isUserSender && isRead" />
      <PhoneOutgoingIcon v-if="isUserSender && isRead" />
      <PhoneMissedIcon v-if="isSent" />
      <PhoneIcon v-if="isPending" />
      {{ isRead ? isUserSender ? 'Outgoing call' : 'Incoming call' : isPending ? 'Call Failed' : 'Missed call' }}
    </p>
  </RouterLink>
</template>

<style scoped>
h4 {
  color: white;
}

p {
  grid-column: span 2;
  font-size: 12px;
  display: flex;
  flex-direction: row;
}

.no-underline {
  text-decoration: none;
  padding: .5em;
  color: var(--text);
  display: grid;
  grid-template-columns: 1fr auto;

}

span {
  font-size: 12px;
}

.name {
  font-weight: bold;
}

h4,
p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h4,
span {
  text-transform: capitalize;
}

.active-link {
  background: rgba(250, 255, 255, 0.1);
  border-radius: var(--border-radius);
}

.avatar {
  grid-row: span 2;
}

.count {
  background: green;
  align-self: center;

}
</style>