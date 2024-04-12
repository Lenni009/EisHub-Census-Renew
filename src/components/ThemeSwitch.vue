<script setup lang="ts">
// determine preferred theme and update the html element with the respective tag
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
switchTheme(prefersDark ? 'dark' : 'light');

function switchTheme(theme: string | undefined = undefined) {
  const currentTheme = document.documentElement.dataset.theme;
  const computedNewTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const newTheme = theme ?? computedNewTheme;

  // Add a delay before changing the theme
  setTimeout(() => {
    document.documentElement.dataset.theme = newTheme;
    // Add the transition class after the theme has changed
    document.documentElement.classList.add('theme-transition');
    // Remove the transition class after the transition has ended
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500); // 500ms is the duration of the transition defined in CSS
  }, 500);
}
</script>

<template>
  <button
    class="themeswitcher"
    type="button"
    @click="switchTheme()"
  >
    Switch Theme
  </button>
</template>
