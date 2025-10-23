<script setup lang="ts">
import { RouterView } from "vue-router";
import { useDynamicHeight } from "./libs/useDynamicHeight";
import { useKeyboardScrollControl } from "./libs/useKeyboardScrollControl";
import { useOrientation } from "./libs/useOrientation";
import OrientationOverlay from "./components/OrientationOverlay.vue";
import { useDevice } from "./libs/useDevice";

useDynamicHeight("#app");
useDynamicHeight(".foxTales");
useDevice();
useKeyboardScrollControl();

const { isLandscape } = useOrientation();
</script>

<template>
  <div class="foxTales">
    <RouterView />
  </div>
  <OrientationOverlay v-if="isLandscape" />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Story+Script&display=swap");

* {
  user-select: none;
  scrollbar-width: thin;
  scrollbar-color: #654744 #f1e3d3;
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
  overflow: hidden !important;
  background-color: #d3b39d;
}

#app {
  display: flex;
  align-items: center;
  overflow: hidden;
  overscroll-behavior: none;
}

.foxTales {
  margin: 0 auto;
  width: 440px;
  max-width: 440px;
  overflow: auto;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media (min-width: 470px) {
  .foxTales {
    max-height: 95dvh;
  }
}
</style>
