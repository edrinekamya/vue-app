<template>
  <div class="column greetings">
    <h1 class="green">VueApp</h1>
    <h2>Welcome to VueApp</h2>
    <h3>Connect with your friends and family instantly!</h3>
    <section class="row">
      <RouterLink to="/auth/sign-in">
        <button class="sign-in">Sign In</button>
      </RouterLink>
      <RouterLink to="/auth/sign-up">
        <button class="sign-up">Sign Up</button>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
div {
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

h1,
h2,
h3 {
  text-align: center;
}

.row {
  gap: 0.5em;
}

h3 {
  font-size: 1rem;
}

.sign-up {
  background: dodgerblue;
}

.sign-in {
  background: limegreen;
}
</style>
