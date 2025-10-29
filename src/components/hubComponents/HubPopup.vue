<script setup lang="ts">
  const isVisible = defineModel({ type: Boolean, required: true });
</script>

<template>
  <div class="hubPopup">
    <div v-if="isVisible" @click="isVisible = false" class="hubPopup_mask" />
    <div class="hubPopup_content" :class="{ isVisible: isVisible }">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  .hubPopup {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 4;

    &_mask {
      width: 100vw;
      height: 100%;
      background-color: black;
      z-index: 1;
      opacity: 0.2;
    }

    &_content {
      position: absolute;
      transform: scale(0.00001);
      z-index: 2;
      margin: 0 auto;
      &.isVisible {
        transition: transform 0.3s;
        transform: scale(1);
      }
    }
  }
</style>
