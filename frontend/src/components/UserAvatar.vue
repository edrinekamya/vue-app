<script setup lang="ts">
defineProps<{
  size?: string
  src?: string
  alt?: string
}>()
</script>

<template>
  <img :alt="alt ?? 'alt'" class="logo" :src="src" :width="size ?? '32'" :height="size ?? '32'" />
</template>