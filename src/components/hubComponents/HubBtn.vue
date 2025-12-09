<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({
    text: { type: String, required: false },
    icon: { type: String, required: false },
    isOrange: { type: Boolean, default: false },
    isSwitch: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    action: { type: Function, required: true },
  });

  const isBtnClicked = ref(false);

  const handleAction = () => {
    if (props.isSwitch) isBtnClicked.value = !isBtnClicked.value;
    props.action();
  };
</script>

<template>
  <div
    data-no-blur
    class="hubBtn"
    :class="[
      { disabled },
      isBtnClicked
        ? isOrange
          ? 'hubBtn--darkOrange'
          : 'hubBtn--darkBrown'
        : isOrange
          ? 'hubBtn--orange'
          : 'hubBtn--brown',
    ]"
    @click="handleAction()"
  >
    <p v-if="text">{{ $t(text) }}</p>
    <v-icon v-if="icon">{{ icon }}</v-icon>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .hubBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px 20px;
    border-radius: 12px;
    color: $whiteColor;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;

    &--brown {
      background: linear-gradient(135deg, $mainBrownColor, $lightBrownColor);
    }

    &--darkBrown {
      background: linear-gradient(
        135deg,
        darken($mainBrownColor, 10%),
        darken($lightBrownColor, 10%)
      );
    }

    &--orange {
      background: linear-gradient(135deg, $mainOrangeColor, lighten($mainOrangeColor, 10%));
    }

    &--darkOrange {
      background: linear-gradient(
        135deg,
        darken($mainOrangeColor, 10%),
        darken($mainOrangeColor, 20%)
      );
    }

    &.disabled {
      pointer-events: none;
      background: $lightGrayColor !important;
      color: #aaa;
      transform: none;
    }

    p {
      margin: 0;
    }
  }
</style>
