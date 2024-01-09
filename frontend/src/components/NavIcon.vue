<script setup lang='ts'>
import { type RouteLocationRaw } from 'vue-router';

defineProps<{
  to: RouteLocationRaw
}>()

</script>

<template>
  <RouterLink class="flex" active-class="link-active" :to="to">
    <button class="flex row">
      <div></div>
      <slot></slot>
    </button>
  </RouterLink>
</template>

<style scoped>
button {
  color: white;
  column-gap: .5em;
  border-radius: var(--border-radius);
  padding: .5em;
  padding-left: 0;
  background: transparent;
}

button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.link-active>button,
.link-active>button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: limegreen;
}

.link-active>button>div {
  background: limegreen;
  height: 100%;
}

button>div {
  width: 3px;
  height: 0;
  border-radius: 1em;
  transition: height 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>