<script setup lang="ts">
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
</script>

<template>
  <div class="hubAccordionElement whiteCard">
    <p class="hubAccordionElement_title">{{ $t(title) }}</p>
    <div class="hubAccordionElement_container" :class="{ isHidden: !isOpen }">
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
    max-height: 350px;
    transition: max-height 0.8s;
    overflow: hidden;
    
    &.isHidden {
      transition: all 0.8s;
      max-height: 0;
    }
  }
}
</style>
