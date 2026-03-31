<script setup lang="ts">
  import HubTooltip from './HubTooltip.vue';
  import { ICON } from '@/enums/iconsEnum';

  const props = withDefaults(
    defineProps<{
      label?: string;
      tooltipText?: string;
      withIcon?: boolean;
      inset?: boolean;
      color?: string;
    }>(),
    {
      tooltipText: '',
      inset: true,
      color: 'orange',
    }
  );

  const value = defineModel({ type: Boolean, required: true });

  const emit = defineEmits<{
    (e: 'onSwitchChange', newValue: boolean | null): void;
  }>();

  const onSwitchChange = (newValue: boolean | null) => {
    emit('onSwitchChange', newValue);
  };
</script>

<template>
  <div class="hubSwitch" :class="{ noInset: !props.inset }">
    <HubTooltip :tooltipText="props.tooltipText" :tooltipDisabled="!props.tooltipText">
      <div class="hubSwitch_content">
        <span v-if="props.label">{{ $t(props.label) }}</span>
        <div v-if="props.withIcon" class="iconContainer">
          <v-icon>{{ ICON.INFO }}</v-icon>
        </div>
      </div>
    </HubTooltip>
    <v-switch
      v-model="value"
      :inset="props.inset"
      hide-details
      :color="props.color"
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
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    &.noInset .v-switch .v-selection-control {
      min-height: auto;
    }

    .iconContainer {
      display: flex;
      align-items: center;

      .v-icon {
        font-size: 16px;
        color: $lightGrayColor;
        cursor: help;
        opacity: 0.7;
        transition: opacity 0.2s;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
</style>
