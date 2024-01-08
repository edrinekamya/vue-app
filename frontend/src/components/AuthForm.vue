<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const props = defineProps<{ type: 'sign-in' | 'sign-up' }>()

const store = useAuthStore()
const username = ref('')
const password = ref('')

function submit() {
  if (props.type === 'sign-in') {
    store.signIn(username.value, password.value)
  } else {
    store.signUp(username.value, password.value)
  }
}

</script>

<template>
  <section class="column center">
    <h1>{{ type === 'sign-in' ? 'Sign In' : 'Sign up' }}</h1>
    <form @submit.prevent="submit">
      <input class="search-bar" placeholder="username" required v-model.trim="username" type="text">
      <input placeholder="password" required v-model.trim="password" type="password">
      <span v-show="store.errorMessage">{{ store.errorMessage }}</span>
      <button :class="type === 'sign-in' ? 'sign-up' : 'sign-in'" :disabled="!username || !password" type="submit">{{ type === 'sign-in' ? 'Login' : 'Create' }}</button>
      <p v-if="type === 'sign-in'">
        Don't have an account? <RouterLink to="/auth/sign-up">Sign up</RouterLink>
      </p>
      <p v-else>
          Already have an account? <RouterLink to="/auth/sign-in">Sign in</RouterLink>
        </p>
    </form>
  </section>
</template>
<style scoped>

form {
  display: flex;
  flex-direction: column;
  gap: .5em
}

span {
  color: red;
  font-size: .8em;
}

button:disabled {
  color: gray;
  background-color: var(--bg-black-1);
}

button {
  background-color: limegreen;
}

input.sign-up {
  background: dodgerblue;
}


</style>