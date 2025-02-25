<script setup lang="ts">
import { ref } from "vue";

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
const toggleTooltip = () => {
  if (props.tooltipDisabled) {
    return;
  }

  isTooltipActive.value = !isTooltipActive.value;
};
</script>

<template>
  <v-tooltip v-model="isTooltipActive" location="top">
    <template v-slot:activator="{ props }">
      <div class="hubTooltip" :class="{maxWidth: maxWidth}" @click="toggleTooltip" v-bind="props">
        <slot></slot>
      </div>
    </template>
    <span v-if="dictsDisabled">{{ tooltipText }}</span>
    <span v-else>{{ $t(tooltipText) }}</span>
  </v-tooltip>
</template>

<style lang="scss">


.hubTooltip {
  &.maxWidth {
    width: 100%;
  }
}
</style>