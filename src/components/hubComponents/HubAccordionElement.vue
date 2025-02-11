<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isOpen: {
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

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      setHeight();
    } else {
      currentHeight.value = 0;
    }
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: "toggleAccordion"): void;
}>();

const toggleAccordion = () => {
  emit("toggleAccordion");
};
</script>

<template>
  <div class="hubAccordionElement whiteCard">
    <p @click="toggleAccordion()" class="hubAccordionElement_title">
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
  }
  &_container {
    overflow: hidden;
    transition: height 0.4s;
  }
}
</style>
