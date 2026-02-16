<script setup lang="ts">
  const props = defineProps({
    text: { type: String, required: false },
    icon: { type: String, required: false },
    loading: { type: Boolean, default: false },
    isOrange: { type: Boolean, default: false },
    ghost: { type: Boolean, default: false },
    isClicked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    action: { type: Function, required: true },
    useDicts: { type: Boolean, default: true },
  });

  const handleAction = () => {
    if (props.loading || props.disabled) {
      return;
    }

    props.action();
  };
</script>

<template>
  <div
    data-no-blur
    class="hubBtn"
    :class="[
      { loading, disabled, small, ghost },
      isClicked
        ? isOrange
          ? 'hubBtn--darkOrange'
          : 'hubBtn--darkBrown'
        : isOrange
          ? 'hubBtn--orange'
          : 'hubBtn--brown',
    ]"
    @click="handleAction()"
  >
    <div v-if="loading" class="loader"></div>
    <template v-else>
      <p v-if="text">{{ useDicts ? $t(text) : text }}</p>
      <v-icon v-if="icon">{{ icon }}</v-icon>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  @use 'sass:color';

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
        color.scale($mainBrownColor, $lightness: -10%),
        color.scale($lightBrownColor, $lightness: -10%)
      );
    }

    &--orange {
      background: linear-gradient(
        135deg,
        $mainOrangeColor,
        color.scale($mainOrangeColor, $lightness: 10%)
      );
    }

    &--darkOrange {
      background: linear-gradient(
        135deg,
        color.scale($mainOrangeColor, $lightness: -10%),
        color.scale($mainOrangeColor, $lightness: -20%)
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

  .ghost {
    background: transparent;
    color: $whiteColor;
  }

  .small {
    max-height: 34px;
    font-size: 14px;
  }

  .loader {
    width: 22px;
    height: 22px;
    border: 3px solid rgb(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
