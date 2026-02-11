<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';

  const { teamId = 0 } = defineProps<{
    teamId?: number;
  }>();

  const color = {
    0: 'red',
    1: 'green',
    2: 'blue',
    3: 'yellow',
    4: 'pink',
  };
</script>

<template>
  <div class="teamIcon" :style="{ color: color[teamId] }">
    <v-icon>{{ ICON.TEAM }}</v-icon>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .teamIcon {
    box-shadow:
      rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    background-color: $whiteColor;
    border-radius: 50%;
    padding: 4px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
