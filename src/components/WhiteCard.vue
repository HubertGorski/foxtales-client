<script setup lang="ts">
const props = defineProps({
  header: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="whiteCard">
    <div class="header">{{ header }}</div>
    <v-divider />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

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
