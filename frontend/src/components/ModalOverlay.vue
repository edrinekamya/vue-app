<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-show="isOpen" @click.stop="$emit('close')" class="modal">
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease;
}

.modal {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  backdrop-filter: blur(2px);
  background: transparent;
  display: flex;
  justify-content: center;
}
</style>
