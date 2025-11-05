<script setup lang="ts">
  import { useViewStore } from '@/stores/viewStore';
  import { computed, ref } from 'vue';

  const props = defineProps({
    isEnabled: {
      type: Boolean,
      default: false,
    },
  });

  const isMobile = useViewStore().getIsMobile();

  const isSelected = ref<boolean>(false);

  const isMaskVisible = computed(() => isSelected.value && props.isEnabled);

  function onMouseEnter() {
    if (isMobile) {
      return;
    }

    isSelected.value = true;
  }
  function onMouseLeave() {
    if (isMobile) {
      return;
    }

    isSelected.value = false;
  }
</script>

<template>
  <div
    class="isComing"
    @click="isSelected = !isSelected"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="isComing_mask" :class="{ isMaskVisible: isMaskVisible }">
      <img class="fox" src="/src/assets/imgs/isComingFox.webp" alt="Lisek" />
      <span class="info">{{ $t('isComing') }}</span>
    </div>
    <div :class="{ noneEvents: isEnabled }">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .isComing {
    position: relative;
    transition: all 0.4s;
    overflow: hidden;

    .noneEvents {
      pointer-events: none;
    }

    &_mask {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      opacity: 0;
      background-color: #fff5eae8;
      z-index: -1;
      transition: all 0.4s;

      .info {
        color: $mainBrownColor;
        font-weight: 600;
        font-size: 20px;
      }

      .fox {
        height: 150px;
      }

      &.isMaskVisible {
        opacity: 1;
        z-index: 1;
      }
    }
  }
</style>
