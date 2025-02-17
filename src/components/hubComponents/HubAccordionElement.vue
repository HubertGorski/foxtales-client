<script setup lang="ts">
import { ref, watchEffect } from "vue";

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
});

const containerRef = ref<HTMLElement | null>(null);
const currentHeight = ref(0);

const setHeight = () => {
  if (containerRef.value) {
    currentHeight.value = containerRef.value.scrollHeight;
  }
};

watchEffect(() => {
  if (props.isOpen) {
    setHeight();
  } else {
    currentHeight.value = 0;
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
    <p
      @click="toggleAccordion()"
      class="hubAccordionElement_title"
      :class="{ isSmallerTitle: isSmallerTitle }"
    >
      {{ $t(title) }}
    </p>
    <div
      ref="containerRef"
      class="hubAccordionElement_container"
      :style="{
        height: isOpen ? `${currentHeight}px` : '0px',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubAccordionElement {
  &_title {
    color: $grayColor;
    font-size: 24px;
    font-weight: 600;
    padding: 24px;
    
    &.isSmallerTitle {
      font-size: 18px;
    }
  }
  &_container {
    overflow: hidden;
    transition: height 0.4s;
  }
}
</style>
