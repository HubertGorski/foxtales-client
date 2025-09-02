<script setup lang="ts">
import HubTooltip from "./HubTooltip.vue";
import { ICON } from "@/enums/iconsEnum";

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  tooltipText: {
    type: String,
    default: "",
  },
  withIcon: {
    type: Boolean,
    default: false,
  },
});

const value = defineModel({ type: Boolean, required: true });

const emit = defineEmits<{
  (e: "onSwitchChange", newValue: boolean | null): void;
}>();

const onSwitchChange = (newValue: boolean | null) => {
  emit("onSwitchChange", newValue);
};
</script>

<template>
  <div class="hubSwitch">
    <HubTooltip :tooltipText="tooltipText" :tooltipDisabled="!tooltipText">
      <div class="hubSwitch_content">
        <span v-if="label">{{ $t(label) }}</span>
        <v-icon v-if="withIcon">{{ ICON.INFO }}</v-icon>
      </div>
    </HubTooltip>
    <v-switch
      v-model="value"
      inset
      hide-details
      color="orange"
      @update:model-value="onSwitchChange"
    />
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";

.hubSwitch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $grayColor;
  max-height: 50px;

  &_content {
    position: relative;
  }

  .v-icon {
    position: absolute;
    top: 0;
    margin: 2px;
    font-size: 14px;
    color: $lightGrayColor;
  }
}
</style>
