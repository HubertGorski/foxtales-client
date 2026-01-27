<script setup lang="ts">
  import { useViewStore } from '@/stores/viewStore';
  import { computed, ref } from 'vue';
  import IsComingMask from './isComingMask.vue';

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
    <IsComingMask :isMaskVisible="isMaskVisible" />
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
  }
</style>
