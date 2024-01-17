<template>
  <div class="container">
    <main class="column center">
      <RouterLink to="/auth">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      </RouterLink>
      <RouterView />
    </main>
    <footer>
      <p>© 2023 VueApp. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
.container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
}

main,
footer {
  display: flex;
  justify-content: center;
}

footer > p {
  padding: 1em;
  font-size: 12px;
}
</style>
