<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  text: {
    type: String
  },
});
</script>

<template>
  <div class="hubDivider">
    <v-divider />
    <span class="hubDivider_text">{{ props.text }}</span>
    <v-divider />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubDivider {
  display: flex;
  align-items: center;
  width: 100%;

  &_text {
    padding: 0 12px;
    color: $mainBrownColor;
    font-weight: 600;
    font-size: 16px;
    white-space: nowrap;
  }

  .v-divider {
    width: 100%;
  }
}
</style>
