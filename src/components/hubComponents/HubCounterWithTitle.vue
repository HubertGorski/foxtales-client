<script setup lang="ts">
  const { value, maxValue, title } = defineProps<{
    value: number;
    maxValue: number;
    title: string;
  }>();
</script>

<template>
  <div class="hubCounterWithTitle">
    <p class="hubCounterWithTitle_title">{{ title }}</p>
    <p class="hubCounterWithTitle_counter">({{ value }} / {{ maxValue }})</p>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .hubCounterWithTitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $mainBrownColor;
    font-weight: 600;
    width: 100%;

    &_title {
      font-size: 24px;
    }

    &_counter {
      font-size: 18px;
    }
  }
</style>
