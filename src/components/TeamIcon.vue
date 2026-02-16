<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';

  const { teamId = 0 } = defineProps<{
    teamId?: number;
  }>();

  const colors: Record<number, string> = {
    0: 'Black',
    1: 'Green',
    2: 'Red',
    3: 'Chartreuse',
    4: 'Fuchsia',
    5: 'Blue',
    6: 'DarkOrange',
    7: 'Purple',
    8: 'Teal',
    9: 'Brown',
  };

  const getColor = (teamId: number): string => {
    return colors[teamId] ?? 'Black';
  };
</script>

<template>
  <div class="teamIcon" :style="{ color: getColor(teamId) }">
    <v-icon>{{ ICON.TEAM }}</v-icon>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .teamIcon {
    box-shadow:
      rgb(60, 64, 67, 0.3) 0 1px 2px 0,
      rgb(60, 64, 67, 0.15) 0 1px 3px 1px;
    background-color: $whiteColor;
    border-radius: 50%;
    padding: 4px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
