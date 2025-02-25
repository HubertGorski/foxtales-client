<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  tooltipText: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isTooltipActive = ref<boolean>(false);
const toggleTooltip = () => {
  if (props.disabled) {
    return;
  }

  isTooltipActive.value = !isTooltipActive.value;
};
</script>

<template>
  <v-tooltip v-model="isTooltipActive" location="top">
    <template v-slot:activator="{ props }">
      <div class="hubTooltip" @click="toggleTooltip" v-bind="props">
        <slot></slot>
      </div>
    </template>
    <span>{{ $t(tooltipText) }}</span>
  </v-tooltip>
</template>
