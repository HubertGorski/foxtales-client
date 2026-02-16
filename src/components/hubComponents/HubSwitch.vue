<script setup lang="ts">
  import HubTooltip from './HubTooltip.vue';
  import { ICON } from '@/enums/iconsEnum';

  const {
    label,
    tooltipText = '',
    withIcon = false,
    inset = true,
    color = 'orange',
  } = defineProps<{
    label?: string;
    tooltipText?: string;
    withIcon?: boolean;
    inset?: boolean;
    color?: string;
  }>();

  const value = defineModel({ type: Boolean, required: true });

  const emit = defineEmits<{
    (e: 'onSwitchChange', newValue: boolean | null): void;
  }>();

  const onSwitchChange = (newValue: boolean | null) => {
    emit('onSwitchChange', newValue);
  };
</script>

<template>
  <div class="hubSwitch" :class="{ noInset: !inset }">
    <HubTooltip :tooltipText="tooltipText" :tooltipDisabled="!tooltipText">
      <div class="hubSwitch_content">
        <span v-if="label">{{ $t(label) }}</span>
        <div class="iconContainer">
          <v-icon v-if="withIcon">{{ ICON.INFO }}</v-icon>
        </div>
      </div>
    </HubTooltip>
    <v-switch
      v-model="value"
      :inset="inset"
      hide-details
      :color="color"
      @update:model-value="onSwitchChange"
    />
  </div>
</template>

<style lang="scss">
  @use '@/assets/styles/variables' as *;

  .hubSwitch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $grayColor;
    max-height: 50px;

    &_content {
      position: relative;
    }

    &.noInset .v-switch .v-selection-control {
      min-height: auto;
    }

    .iconContainer {
      display: inline;

      .v-icon {
        padding-bottom: 12px;
        margin: 2px;
        font-size: 12px;
        color: $lightGrayColor;
        cursor: help;
      }
    }
  }
</style>
