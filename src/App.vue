<script setup lang="ts">
import { RouterView } from "vue-router";
import { useBeforeUnload } from "./libs/useBeforeUnload";
import { useDynamicHeight } from "./libs/useDynamicHeight";
import { useForceTopOnScroll } from "./libs/useForceTopOnScroll";

useBeforeUnload();
useDynamicHeight("#app");
useDynamicHeight(".foxTales");
useForceTopOnScroll({ cooldownMs: 250, minDelta: 6, ignoreSelector: '.no-force-scroll' })
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
  height: 100%;
  overscroll-behavior: none;
  margin: 0;
  overflow: hidden;
  background-color: #d3b39d;

  /* iOS safe area */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

#app {
  overflow: hidden;
}

.foxTales {
  margin: 0 auto;
  max-width: 380px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
