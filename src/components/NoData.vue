<script setup lang="ts">
  import { computed } from 'vue';

  const {
    emptyDataText = 'emptyData',
    boxShadow = false,
    big = false,
  } = defineProps<{
    emptyDataText?: string;
    boxShadow?: boolean;
    big?: boolean;
  }>();

  const small = computed(() => !big);
</script>

<template>
  <div class="noData" :class="{ boxShadow, big, small }">
    <img src="@/assets/imgs/fox-icon.webp" alt="Lisek" />
    <p>{{ $t(emptyDataText) }}</p>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .noData {
    display: flex;
    align-items: center;
    opacity: 0.9;

    p {
      color: $mainBrownColor;
      font-weight: 600;
      font-style: italic;
      font-size: 14px;
    }

    &.boxShadow {
      background: $background;
      border-radius: 12px;
      box-shadow:
        0 4px 6px rgb(0, 0, 0, 0.1),
        0 1px 3px rgb(0, 0, 0, 0.06);
    }

    &.small {
      gap: 16px;
      padding: 4px 8px;

      img {
        width: 64px;
      }
    }

    &.big {
      flex-direction: column;

      img {
        padding: 16px 64px;
        max-height: 164px;
      }
    }
  }
</style>
