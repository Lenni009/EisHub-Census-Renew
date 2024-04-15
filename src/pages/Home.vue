<script setup lang="ts">
const cards: {
  header: string;
  body: string;
  link: string;
  linkText: string;
}[] = [
  {
    header: 'Table',
    body: "Eisvana's Census table, including past census data and management functions.",
    link: './table.html',
    linkText: 'Table',
  },
  {
    header: 'Form',
    body: 'New to Eisvana? Fill out the census form here!',
    link: './form.html',
    linkText: 'Form',
  },
  {
    header: 'Renew',
    body: 'Renew your census entry here if you are not on the census anymore!',
    link: './renew.html',
    linkText: 'Renew',
  },
];
</script>

<template>
  <div class="title-group">
    <h1>Eisvana Census</h1>
    <p class="subtitle">Welcome to Eisvana's Census Portal!</p>
  </div>

  <div class="link-list">
    <article v-for="card in cards">
      <header class="text-bold text-center">{{ card.header }}</header>
      <p>{{ card.body }}</p>
      <footer class="text-center">
        <a :href="card.link">{{ card.linkText }}</a>
      </footer>
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

    p {
      text-wrap: balance;
    }
  }
}
</style>
