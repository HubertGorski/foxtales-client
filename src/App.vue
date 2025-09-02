<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="foxTalesBackground">
    <div class="foxTales">
      <RouterView />
    </div>
  </div>
</template>

<style>
* {
  user-select: none;
  scrollbar-width: thin;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow: hidden;
}
.foxTalesBackground {
  height: 100%;
  background-color: #c9b6b4;
}

.foxTales {
  margin: 0 auto;
  max-width: 380px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
