<script setup lang="ts">
  import { useAutoHeight } from '@/composables/useAutoHeight';
  import { ICON } from '@/enums/iconsEnum';
  import { ref, toRef } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    isSmallerTitle: {
      type: Boolean,
      default: false,
    },
    withStatusIcon: {
      type: Boolean,
      default: false,
    },
    isTitleCenter: {
      type: Boolean,
      default: false,
    },
    centerContent: {
      type: Boolean,
      default: false,
    },
    darkBackground: {
      type: Boolean,
      default: true,
    },
  });

  const contentRef = ref<HTMLElement | null>(null);
  const { currentHeight } = useAutoHeight(contentRef, toRef(props, 'isOpen'));

  const emit = defineEmits<{
    (e: 'toggleAccordion'): void;
  }>();

  const toggleAccordion = () => {
    emit('toggleAccordion');
  };
</script>

<template>
  <div class="hubAccordionElement creamCard">
    <div
      class="hubAccordionElement_title"
      :class="{ isSmallerTitle: isSmallerTitle, isOpen: isOpen }"
      @click="toggleAccordion()"
    >
      <p :class="{ isTitleCenter: isTitleCenter }">
        {{ $t(title) }}
      </p>
      <v-icon v-if="withStatusIcon">{{ ICON.CHEVRON_UP }}</v-icon>
    </div>
    <div
      class="hubAccordionElement_container"
      :class="{ centerContent, darkBackground }"
      :style="{
        height: isOpen ? currentHeight : '0px',
      }"
    >
      <div ref="contentRef" style="display: flow-root">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubAccordionElement {
    overflow: hidden;
    min-height: 60px;
    cursor: pointer;

    &_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
      padding: 24px;
      transition:
        background-color,
        padding 0.4s;

      .isTitleCenter {
        text-align: center;
        width: 100%;
      }

      .v-icon {
        transition: transform 0.4s;
        transform: rotate(-180deg);
      }

      &.isSmallerTitle {
        font-size: 18px;
        padding: 16px;
      }

      &.isOpen {
        padding: 12px;
        transition:
          background-color,
          padding 0.4s;
        background-color: $lightBrownColor;
        color: white;
        border-radius: 4px;

        .v-icon {
          transform: rotate(0deg);
          transition: transform 0.4s;
        }
      }
    }

    &_container {
      overflow: hidden;
      transition: height 0.4s;

      &.centerContent {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &.darkBackground {
        background-color: $lightBrownColor;
      }
    }
  }
</style>
