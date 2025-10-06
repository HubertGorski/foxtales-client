<script setup lang="ts">
import { RouterView } from "vue-router";
import { useBeforeUnload } from "./libs/useBeforeUnload";

useBeforeUnload();
</script>

<template>
  <div class="foxTales">
    <RouterView />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Story+Script&display=swap");

* {
  user-select: none;
  scrollbar-width: thin;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100dvh;
  overscroll-behavior: none;
  margin: 0;
  overflow: hidden;
  background-color: #d3b39d;

  /* iOS */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

#app {
  height: 100dvh;
  overflow: hidden;
}

.foxTales {
  margin: 0 auto;
  max-width: 380px;
  height: 100dvh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
