<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';

const store = useGlobalStore()

</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-show="store.isNotificationOpen" class="modal">
        <div class="slot" id="notification"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
div>button {
  position: absolute;
  right: 1em;
  top: 1em
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(200px);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slot {
  flex: 1;
  display: flex;
  background: var(--bg-black-2);
  padding: 1em;
}

.modal {
  position: absolute;
  min-width: 40vw;
  z-index: 99;
  display: flex;
  bottom: 1em;
  right: 1em;
  overflow: auto;
}
</style>