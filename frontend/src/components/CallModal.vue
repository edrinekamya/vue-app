<script setup lang='ts'>
import { useCallStore } from '@/stores/call';
import { useGlobalStore } from '@/stores/global';
import { useDraggable } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount } from 'vue';
import AudioSpectrum from './AudioSpectrum.vue';
import ModalOverlay from './ModalOverlay.vue';
import PhoneIcon from './icons/PhoneIcon.vue';
import PhoneIncomingIcon from './icons/PhoneIncomingIcon.vue';
import PhoneOutgoingIcon from './icons/PhoneOutgoingIcon.vue';
import VideoOnIcon from './icons/VideoOnIcon.vue';

const call = useCallStore()
const notification = useGlobalStore()
const { localElement, remoteElement } = storeToRefs(call)
const { style } = useDraggable(localElement, {
  initialValue: {
    x: 10,
    y: 10
  }
})

function answer() {
  notification.closeNotification()
  call.answer()
}

function reject() {
  notification.closeNotification()
  call.reject()
}

onBeforeUnmount(() => {
  call.hangup()
})

</script>

<template>
  <ModalOverlay :is-open="call.isModalOpen">
    <div @click.stop="null" class="column flex call">
      <section v-if="call.isVideo">
        <video class="full" :muted="call.isMuted" autoplay ref="remoteElement"></video>
        <video muted autoplay :style="call.isConnected ? style : {}" ref="localElement"
          :class="call.isConnected ? 'popup' : 'full'" class="local-video"></video>
        <span class="peer-name">{{ call.peer.username }}</span>
        <span class="video-status">{{ call.isConnected ? call.duration : `${call.status}...` }}</span>
      </section>
      <section v-else class="column flex center">
        <h1 v-if="!call.isConnected">{{ call.peer?.username }}</h1>
        <h3 class="row">
          <PhoneOutgoingIcon v-if="call.isInitiator" />
          <PhoneIncomingIcon v-else /> {{ call.isInitiator ? 'Outgoing call' : 'Incoming call' }}
        </h3>
        <p v-if="!call.isConnected">
          {{ call.status }}...
        </p>
        <section class="column center" v-else>
          <span>{{ call.duration }}</span>
          <AudioSpectrum />
        </section>
        <audio autoplay muted ref="localElement"></audio>
        <audio autoplay :muted="call.isMuted" ref="remoteElement"></audio>
      </section>
      <section class="row controls">
        <button class="row round danger" @click="call.hangup">
          <PhoneIcon />
        </button>
      </section>
      <Teleport to="body">
        <Transition name="slide">
          <div v-show="call.isNotificationOpen" class="column modal">
            <p class="row">
              <VideoOnIcon v-if="call.isVideo" />
              <PhoneIcon v-else />
              Incoming call
            </p>
            <section class="column flex">
              <h2>{{ call.peer?.username }}</h2>
            </section>
            <section class="btn row">
              <button class="round" @click="answer">Answer</button>
              <button class="round danger" @click="reject">Reject</button>
            </section>
          </div>
        </Transition>
      </Teleport>
    </div>
  </ModalOverlay>
</template>

<style scoped>
.video-status,
.peer-name {
  position: absolute;
  background: var(--bg-black-2);
  padding: .2em .5em;
  border-radius: .2em;
  z-index: 2;
}

.modal {
  position: absolute;
  min-width: 40vw;
  height: auto;
  z-index: 99;
  display: flex;
  bottom: 1em;
  right: 1em;
  overflow: auto;
  gap: .5em;
  background: var(--bg-black-3);
}

button>svg {
  width: 32px;
}

button.round {
  font-size: 1em;
  height: 36px;
}

.btn {
  gap: .5em;
}

.btn>button {
  flex: 1;
}

.peer-name {
  left: 1em;
  top: 1em;
}

.video-status {
  right: 1em;
  bottom: 1em;
}

.call {
  background: rgb(30, 30, 30);
}

.close {
  align-self: flex-end;
  z-index: 99;
  position: absolute;
  right: 1em;
  top: 1em;
}

span,
p,
h1,
h2 {
  text-transform: capitalize;
}

.controls {
  column-gap: .5em;
  padding: 1em;
  border-radius: 999px;
  justify-content: center;
  position: absolute;
  z-index: 10;
  bottom: 2em;
  left: 0;
  right: 0;
}

.center {
  gap: .5em;
}

video {
  transform: scaleX(-1);
  object-fit: cover;
}

.local-video {
  position: absolute;
  z-index: 1;
  transform: all 2s ease;
}

.full {
  width: 100%;
  height: 100%;
  top: 0;
  right: 0
}

.popup {
  width: 40vw;
  height: 40vh;
}
</style>