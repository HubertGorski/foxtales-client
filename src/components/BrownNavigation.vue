<script setup lang="ts">
  const props = defineProps({
    textBtn: { type: String, required: true },
    textInfo: { type: String, required: true },
    action: { type: Function, required: true },
  });
</script>

<template>
  <div class="brownNavigation">
    <div class="brownNavigation_btn" @click="() => props.action()">{{ textBtn }}</div>
    <div class="brownNavigation_info">{{ textInfo }}</div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .brownNavigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $mainBrownColor;
    color: $whiteColor;
    width: 100%;
    padding: 4px 8px;

    &_btn {
      padding: 4px 12px;
      cursor: pointer;
    }

    &_info {
      font-style: italic;
      font-size: 14px;
    }
  }
</style>
