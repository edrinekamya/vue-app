<script setup lang='ts'>
defineEmits(['click'])
</script>

<template>
  <div @click="$emit('click')" class="center button">
    <slot></slot>
  </div>
</template>

<style scoped>
.button {
  width: 24px;
  border-radius: var(--border-radius);
}

.button:hover {
  background: var(--bg-black-2);
}
</style>