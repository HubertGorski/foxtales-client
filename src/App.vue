<script setup lang="ts">
  import { RouterView } from 'vue-router';
  // import { useDynamicHeight } from './libs/useDynamicHeight';
  // import { useKeyboardScrollControl } from './libs/useKeyboardScrollControl';
  import { useOrientation } from './libs/useOrientation';
  import OrientationOverlay from './components/OrientationOverlay.vue';
  import { useDevice } from './libs/useDevice';
  import { computed, ref } from 'vue';
  import { useSignalRStore } from './stores/signalRStore';
  import { ICON } from './enums/iconsEnum';
  import { useUserStore } from './stores/userStore';

  useDevice();

  const { isLandscape } = useOrientation();
  const showErrorPanel = ref<boolean>(true);
  const connectionError = computed(
    () => useSignalRStore().connectionError ?? useUserStore().connectionError
  );
</script>

<template>
  <div class="foxTales">
    <div
      v-if="connectionError"
      class="foxTales_error"
      :class="{ showErrorPanel: showErrorPanel }"
      @click="showErrorPanel = !showErrorPanel"
    >
      <v-icon>{{ ICON.ERROR }}</v-icon>
      <span>{{ $t(connectionError) }}</span>
    </div>
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

  .foxTales_error {
    position: fixed;
    background-color: #b00020;
    color: white;
    z-index: 9999;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    margin: 4px;
    transition: all 0.4s;
    overflow: hidden;
  }

  .foxTales_error .v-icon {
    margin: 0 4px;
  }

  .foxTales_error span {
    font-size: 12px;
    padding-left: 4px;
  }

  .foxTales_error.showErrorPanel {
    width: 420px;
  }

  @media (min-width: 470px) {
    .foxTales {
      max-height: 95dvh;
      border-radius: 12px;
    }
  }
</style>
