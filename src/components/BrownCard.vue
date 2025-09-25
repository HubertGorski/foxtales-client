<script setup lang="ts">
const props = defineProps({
  header: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="brownCard">
    <div class="header">{{ header }}</div>
    <v-divider />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.brownCard {
  background: linear-gradient(135deg, #5a3f37, #8d5c52);
  padding: 12px 8px;
  margin: 8px 0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;

  .header {
    color: $whiteColor;
    font-size: 16px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-divider {
    margin: 8px 0;
    border-color: rgba(255, 255, 255, 0.3);
  }

  ::v-deep > *:not(.header):not(.v-divider) {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px 14px;
    border-radius: 8px;
    margin-top: 8px;
    color: $whiteColor;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-style: italic;
    letter-spacing: 0.5px;
  }
}
</style>
