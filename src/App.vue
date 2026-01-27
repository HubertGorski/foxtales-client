<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { useOrientation } from './libs/useOrientation';
  import OrientationOverlay from './components/OrientationOverlay.vue';
  import { useDevice } from './libs/useDevice';
  import HubErrorPanel from './components/hubComponents/HubErrorPanel.vue';

  useDevice();

  const { isLandscape } = useOrientation();
</script>

<template>
  <div class="foxTales">
    <HubErrorPanel />
    <RouterView />
  </div>
  <OrientationOverlay v-if="isLandscape" />
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Story+Script&display=swap');

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
    height: 100dvh;
    height: var(--real-vh, 100dvh);
    overscroll-behavior: none;
    margin: 0;
    overflow: hidden !important;
    -webkit-tap-highlight-color: transparent;
    background-color: #d3b39d;
  }

  body {
    position: fixed;
    inset: 0;
  }

  ul,
  ol {
    padding-left: 16px;
  }

  #app {
    display: flex;
    align-items: center;
    overflow: hidden;
    overscroll-behavior: none;
    height: 100%;
  }

  .foxTales {
    margin: 0 auto;
    width: 440px;
    max-width: 440px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    position: relative;
  }

  @media (min-width: 470px) {
    .foxTales {
      max-height: 95dvh;
      border-radius: 12px;
    }
  }
</style>
