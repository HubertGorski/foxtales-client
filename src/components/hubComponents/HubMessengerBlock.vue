<script setup lang="ts">
  import { useViewStore } from '@/stores/viewStore';

  const appVersion = import.meta.env.VITE_APP_VERSION;
  const { redirectPath } = useViewStore();
</script>

<template>
  <div class="messengerBlock">
    <div class="messengerBlock_card">
      <div class="messengerBlock_fox"></div>
      <div class="messengerBlock_title" v-html="$t('messengerTitle')"></div>
      <div class="messengerBlock_text" v-html="$t('messengerSub')"></div>
      <div class="messengerBlock_steps" v-html="$t('messengerStep1')"></div>
      <div class="messengerBlock_steps" v-html="$t('messengerStep2')"></div>
      <div class="messengerBlock_version">v.{{ appVersion }}</div>
      {{ redirectPath }}
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/hubAnimations' as *;

  .messengerBlock {
    display: flex;
    position: fixed;
    flex-direction: column;
    inset: 0;
    z-index: 9999;
    background: linear-gradient(160deg, #fff5ea 0%, #f1e3d3 60%, #e8cdb8 100%);
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    font-family: sans-serif;

    &_card {
      position: relative;
      background: linear-gradient(135deg, #f1e3d3, #d3b39d);
      border-radius: 20px;
      padding: 24px 24px 12px;
      max-width: 360px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(84, 50, 47, 0.1);
    }

    &_title {
      font-size: 22px;
      font-weight: 700;
      color: #e38924;
      margin-bottom: 10px;
    }

    &_text {
      font-size: 14px;
      color: #54322f;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    &_steps {
      font-size: 13px;
      color: #654744;
      line-height: 1.6;
      text-align: left;

      b {
        color: #54322f;
      }
    }

    &_fox {
      position: absolute;
      top: -140px;
      right: 13px;
      min-width: 123px;
      min-height: 156px;
      background-image: url('/imgs/memoryFoxRight.webp');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    &_version {
      color: $mainBrownColor;
      font-size: 12px;
      font-style: italic;
      text-align: right;
      opacity: 0.2;
    }
  }
</style>
