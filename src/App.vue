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
@import url('https://fonts.googleapis.com/css2?family=Story+Script&display=swap');

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
  background-color: #d3b39d;
}

#app {
  height: 100%;
  overflow: hidden;
}
.foxTalesBackground {
  height: 100%;
  background-color: #d3b39d;
}

.foxTales {
  margin: 0 auto;
  max-width: 380px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
