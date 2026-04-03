<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { useOrientation } from './libs/useOrientation';
  import OrientationOverlay from './components/OrientationOverlay.vue';
  import { useDevice } from './libs/useDevice';
  import { useKeyboardScrollControl } from './libs/useKeyboardScrollControl';
  import HubErrorPanel from './components/hubComponents/HubErrorPanel.vue';
  // import HubMessengerBlock from './components/hubComponents/HubMessengerBlock.vue';
  // import { isMessenger as detectIsMessenger } from './utils/userAgentUtils';

  useDevice();
  useKeyboardScrollControl();

  const { isLandscape } = useOrientation();

  // const isMessenger = detectIsMessenger();
</script>

<template>
  <div class="foxTales">
    <HubErrorPanel />
    <RouterView />
  </div>
  <OrientationOverlay v-if="isLandscape" />
  <!-- <HubMessengerBlock v-if="isMessenger" /> -->
</template>

<style>
  * {
    user-select: none;
    scrollbar-width: thin;
    scrollbar-color: #654744 #f1e3d3;
  }

  input,
  textarea {
    user-select: text !important;
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
    overscroll-behavior: none;
    margin: 0;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    background-color: #d3b39d;
  }

  /* Ensure body stays relative for popups */
  body {
    position: relative;
  }

  ul,
  ol {
    padding-left: 16px;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow: hidden;
  }

  .foxTales {
    margin: 0 auto;
    width: 100%;
    max-width: 440px;
    height: 100%;
    overflow: hidden auto;
    box-shadow: rgb(0, 0, 0, 0.24) 0 3px 8px;
    position: relative;
  }

  @media (min-width: 470px) {
    .foxTales {
      max-height: 95dvh;
      border-radius: 12px;
    }
  }
</style>
