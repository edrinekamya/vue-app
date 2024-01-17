<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  name: String
}>()
</script>

<template>
  <RouterLink class="router-link" active-class="link-active" :to="to">
    <div class="bar"></div>
    <button class="row">
      <slot></slot>
    </button>
    <span>{{ name }}</span>
  </RouterLink>
</template>

<style scoped>
span {
  line-height: 1;
}

button {
  background: transparent;
  padding: 0.2em;
  height: auto;
}

.router-link {
  text-decoration: none;
  color: white;
  border-radius: var(--border-radius);
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5em;
  padding-top: 0;
}

.bar {
  width: 100%;
  height: 2px;
  border-radius: 1em;
  transition: width 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.router-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.link-active,
.link-active > button {
  color: limegreen;
}

.link-active:hover {
  background: transparent;
}

@media (min-width: 576px) {
  .router-link {
    flex-direction: row;
    align-items: center;
    padding-left: 0;
    padding-top: 0.5em;
  }

  .link-active {
    background: rgba(255, 255, 255, 0.1);
  }

  .link-active > .bar {
    height: 100%;
    width: 2px;
    background: limegreen;
  }

  .bar {
    transition: height 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  span {
    display: none;
  }
}
</style>
