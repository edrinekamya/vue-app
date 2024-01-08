<script setup lang="ts">
defineProps({
  size: String
})
</script>

<template>
  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" :width="size ?? '125'" :height="size ?? '125'" />
</template>