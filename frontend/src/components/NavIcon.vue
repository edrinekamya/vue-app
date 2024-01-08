<script setup lang='ts'>
import { type RouteLocationRaw } from 'vue-router';

defineProps<{
  to: RouteLocationRaw
}>()

</script>

<template>
  <RouterLink class="row router-link" active-class="link-active" :to="to">
    <div></div>
    <slot></slot>
  </RouterLink>
</template>

<style scoped>
.router-link {
  text-decoration: none;
  color: white;
  column-gap: .5em;
  border-radius: 4px;
  padding: .5em;
  padding-left: 0;
}

.router-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.link-active,
.link-active:hover {
  background: rgba(255, 255, 255, 0.1);
  color: limegreen;
}

.router-link>div {
  width: 3px;
  height: 0;
  border-radius: 1em;
  transition: height 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.link-active>svg {
  color: limegreen;
}

.link-active>div {
  background: limegreen;
  height: 100%;
}
</style>