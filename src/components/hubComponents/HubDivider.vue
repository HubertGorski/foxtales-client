<script setup lang="ts">
  const props = defineProps({
    text: {
      type: String,
    },
  });
</script>

<template>
  <div class="hubDivider" :class="{ 'pt-2 pb-2': !props.text }">
    <v-divider />
    <span v-if="props.text" class="hubDivider_text">{{ props.text }}</span>
    <v-divider />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubDivider {
    display: flex;
    align-items: center;
    width: 100%;

    &_text {
      padding: 0 12px;
      color: $mainBrownColor;
      font-weight: 600;
      font-size: 16px;
      white-space: nowrap;
    }

    .v-divider {
      width: 100%;
    }
  }
</style>
