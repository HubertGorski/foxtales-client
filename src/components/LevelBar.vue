<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  requiredPointsToNextLevel: {
    type: Number,
    required: true,
  },
});

const getPointsInPercentages = computed(
  () => (props.points / props.requiredPointsToNextLevel) * 100
);
</script>

<template>
  <div class="levelBar">
    <div class="levelBar_header">
      <div class="level">{{ $t("level") }} {{ level }}</div>
      <div class="points">
        {{ $t("exp") }} {{ points }} / {{ requiredPointsToNextLevel }}
      </div>
    </div>
    <div class="levelBar_bar">
      <div class="currentExp" :style="{ width: getPointsInPercentages + '%' }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.levelBar {
  font-size: 14px;
  font-style: italic;
  color: $mainBrownColor;
  letter-spacing: 0.1px;

  &_header {
    display: flex;
    justify-content: space-between;

    .level {
      // font-weight: 600;
    }
  }
  &_bar {
    width: 100%;
    height: 4px;
    background-color: $lightGrayColor;

    .currentExp {
      background-color: $mainOrangeColor;
      height: 100%;
    }
  }
}
</style>
