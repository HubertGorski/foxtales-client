<script setup lang="ts">
  const {
    isMaskVisible = true,
    isAbsolute = true,
    isComingText = 'isComing',
  } = defineProps<{
    isMaskVisible?: boolean;
    isAbsolute?: boolean;
    isComingText?: string;
  }>();
</script>

<template>
  <div class="isComingMask" :class="{ isMaskVisible: isMaskVisible, isAbsolute: isAbsolute }">
    <img class="fox" src="/src/assets/imgs/isComingFox.webp" alt="Lisek" />
    <span class="info">{{ $t(isComingText) }}</span>
  </div>
</template>

<style lang="scss">
  @import '@/assets/styles/variables';

  .isComingMask {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 240px;
    height: 100%;
    width: 100%;
    opacity: 0;
    background-color: #fff5eae8;
    z-index: -1;
    transition: all 0.4s;

    .info {
      color: $mainBrownColor;
      font-weight: 600;
      font-size: 20px;
      padding: 4px 24px;
      text-align: center;
    }

    .fox {
      height: 150px;
    }

    &.isMaskVisible {
      opacity: 1;
      z-index: 1;
    }

    &.isAbsolute {
      position: absolute;
    }
  }
</style>
