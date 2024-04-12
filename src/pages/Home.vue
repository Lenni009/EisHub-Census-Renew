<template>
  <div class="title-group">
    <h1>Eisvana Census</h1>
    <p class="subtitle">Welcome to Eisvana's Census Portal!</p>
  </div>

  <div class="link-list">
    <article>
      <header class="text-bold">Table</header>
      <p>Eisvana's Census table, including past census data and management functions.</p>
      <footer><a href="./table.html">Table</a></footer>
    </article>
    <article>
      <header class="text-bold">Form</header>
      <p>New to Eisvana? Fill out the census form here!</p>
      <footer><a href="./form.html">Form</a></footer>
    </article>
    <article>
      <header class="text-bold">Renew</header>
      <p>Renew your census entry here if you are not on the census anymore!</p>
      <footer><a href="./renew.html">Renew</a></footer>
    </article>
  </div>
</template>

<style scoped lang="scss">
.title-group {
  text-align: center;
  margin-block-end: 2rem;

  :first-child {
    margin: 0;
  }
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;

  article {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    min-width: min(100%, 300px);
    transition: background-color var(--pico-transition), border-color var(--pico-transition);

    header,
    footer {
      text-align: center;
      transition: background-color var(--pico-transition), border-color var(--pico-transition);
    }

    p {
      text-wrap: balance;
      transition: background-color var(--pico-transition), border-color var(--pico-transition);
    }
  }
}
</style>
