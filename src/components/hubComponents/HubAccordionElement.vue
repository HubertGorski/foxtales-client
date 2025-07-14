<script setup lang="ts">
import { ICON } from "@/enums/iconsEnum";
import { nextTick, ref, watchEffect } from "vue";

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
});

const containerRef = ref<HTMLElement | null>(null);
const currentHeight = ref<string>('0px');

//TODO: naprawic aktualizacje wysokosci
const setHeight = async () => {
  await nextTick();
  if (containerRef.value) {
    currentHeight.value = props.centerContent ? "100%" : `${containerRef.value.scrollHeight}px`;
  }
};

watchEffect(() => {
  if (props.isOpen) {
    setHeight();
  } else {
    currentHeight.value = '0px';
  }
});

const emit = defineEmits<{
  (e: "toggleAccordion"): void;
}>();

const toggleAccordion = () => {
  emit("toggleAccordion");
};
</script>

<template>
  <div class="hubAccordionElement creamCard">
    <div
      @click="toggleAccordion()"
      class="hubAccordionElement_title"
      :class="{ isSmallerTitle: isSmallerTitle, isOpen: isOpen }"
    >
      <p :class="{isTitleCenter: isTitleCenter}">
        {{ $t(title) }}
      </p>
      <v-icon v-if="withStatusIcon">{{ ICON.CHEVRON_UP }}</v-icon>
    </div>
    <div
      ref="containerRef"
      class="hubAccordionElement_container"
      :class="{centerContent: centerContent}"
      :style="{
        height: isOpen ? currentHeight : '0px',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubAccordionElement {
  overflow: hidden;
  min-height: 60px;

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
      background-color: $mainBrownColor;
      color: white;
      border-radius: 4px;

      .v-icon {
        transform: rotate(180deg);
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
  }
}
</style>
