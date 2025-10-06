<script setup lang="ts">
import { RouterView } from "vue-router";
import { useBeforeUnload } from "./libs/useBeforeUnload";
import { useDynamicHeight } from "./libs/useDynamicHeight";

useBeforeUnload();
useDynamicHeight("#app");
useDynamicHeight(".foxTales");
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
  background-color: red;
  position: fixed;
}

#app {
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

.foxTales {
  margin: 0 auto;
  max-width: 380px;
  overflow: auto;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  -webkit-overflow-scrolling: touch;
}
</style>
