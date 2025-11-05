<script setup lang="ts">
  const { text, src } = defineProps<{
    text: string;
    src: string;
  }>();
</script>

<template>
  <div class="foxWithName">
    <div class="foxWithName_name">{{ text }}</div>
    <img class="foxWithName_fox" :src="src" alt="Lisek" />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  .foxWithName {
    &_fox {
      width: 92px;
      margin: 0 16px;
    }

    &_name {
      width: 110px;
      text-align: center;
      padding: 4px 0;
      color: $grayColor;
      font-weight: 600;
      letter-spacing: -1px;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
</style>
