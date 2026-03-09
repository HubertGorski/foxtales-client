<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { useI18n } from 'vue-i18n';

  const {
    code,
    expanded,
    toggleable = false,
  } = defineProps<{
    code: string | null;
    expanded: boolean;
    toggleable?: boolean;
  }>();

  const emit = defineEmits<{
    'update:expanded': [value: boolean];
  }>();

  const { t } = useI18n();

  const handleClick = () => {
    if (expanded && !toggleable) {
      return;
    }

    emit('update:expanded', !expanded);
  };
</script>

<template>
  <div class="codeChip" :class="{ expanded }" @click="handleClick">
    <v-icon class="icon">{{ ICON.CODE }}</v-icon>
    <span v-if="code" class="code">{{ t('lobby.accessCode') }} {{ code }}</span>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .codeChip {
    display: flex;
    align-items: center;
    cursor: pointer;
    min-width: fit-content;
    overflow: hidden;
    background-color: $background;
    border: 2px solid $mainBrownColor;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 24px;
      font-weight: 900;
      color: $mainBrownColor;
    }

    .code {
      color: $mainBrownColor;
      font-weight: 600;
      padding: 0 20px 0 8px;
      font-size: 16px;
      white-space: nowrap;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      transition:
        max-width 0.4s ease,
        opacity 0.3s ease,
        padding 0.4s ease;
      padding-right: 0;
      padding-left: 0;
    }

    &.expanded .code {
      max-width: 300px;
      opacity: 1;
      padding-right: 20px;
    }
  }
</style>
