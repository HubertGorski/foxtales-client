<script setup lang="ts">
  import { ref, computed } from 'vue';

  const props = defineProps({
    tooltipText: {
      type: String,
      required: true,
    },
    tooltipDisabled: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Boolean,
      default: false,
    },
    dictsDisabled: {
      type: Boolean,
      default: false,
    },
  });

  const isTooltipActive = ref<boolean>(false);

  const hasTooltip = computed(() => {
    return !props.tooltipDisabled && props.tooltipText?.trim().length > 0;
  });

  const toggleTooltip = () => {
    if (!hasTooltip.value) return;
    isTooltipActive.value = !isTooltipActive.value;
  };
</script>

<template>
  <div class="hubTooltip" :class="{ maxWidth: maxWidth }">
    <v-tooltip v-if="hasTooltip" v-model="isTooltipActive" location="top">
      <template v-slot:activator="{ props }">
        <div @click="toggleTooltip" v-bind="props">
          <slot></slot>
        </div>
      </template>
      <div class="hubTooltip_content" :class="{ active: isTooltipActive }">
        <span v-if="dictsDisabled">{{ tooltipText }}</span>
        <span v-else>{{ $t(tooltipText) }}</span>
      </div>
    </v-tooltip>
    <slot v-else></slot>
  </div>
</template>

<style lang="scss">
  .hubTooltip {
    &.maxWidth {
      width: 100%;
    }

    &_content {
      opacity: 0;
      transition: opacity 0.2s ease;

      &.active {
        opacity: 1;
      }
    }
  }
</style>
