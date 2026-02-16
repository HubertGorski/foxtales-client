<script setup lang="ts">
  const { errorMessages } = defineProps<{
    errorMessages?: string;
  }>();

  const isSelected = defineModel({ type: Boolean, required: true });
</script>

<template>
  <div>
    <div class="hubCheckbox">
      <v-checkbox
        v-model="isSelected"
        :error-messages="errorMessages"
        hide-details
        density="compact"
        :color="`var(--mainBrownColor)`"
      />
      <div class="hubCheckbox_text" :class="{ hasError: errorMessages }">
        <slot></slot>
      </div>
    </div>
    <div v-if="errorMessages" class="error">
      {{ errorMessages }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubCheckbox {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 4px;

    &_text {
      color: $grayColor;
      font-size: 14px;

      &.hasError {
        color: $errorColor;
      }
    }
  }

  .error {
    width: 100%;
    font-size: 12px;
    padding-inline: 16px;
    line-height: 12px;
    color: $errorColor;
    letter-spacing: 0.4px;
  }
</style>
