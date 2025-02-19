<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  isOrange: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  action: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    @click="action()"
    class="hubBtn"
    :class="[{ disabled }, isOrange ? 'hubBtn--orange' : 'hubBtn--brown']"
  >
    <p v-if="text">{{ text }}</p>
    <v-icon v-if="icon">{{ icon }}</v-icon>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  padding: 20px;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.06);
  white-space: nowrap;

  &--brown {
    background-color: $mainBrownColor;
  }

  &--orange {
    background-color: $mainOrangeColor;
  }

  &.disabled {
    pointer-events: none;
    background-color: $lightGrayColor;
  }
}
</style>
