<script setup lang="ts">
  const { header } = defineProps<{
    header?: string;
  }>();
</script>

<template>
  <div class="whiteCard">
    <div v-if="header" class="header">{{ header }}</div>
    <v-divider v-if="header" />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .header {
    color: $grayColor;
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-divider {
    margin: 4px;
  }
</style>
