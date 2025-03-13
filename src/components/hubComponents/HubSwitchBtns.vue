<script setup lang="ts">
import { computed, type PropType } from "vue";
import { isEqual } from "lodash";

export interface HubSwitchBtnsItem {
  id: number;
  title: string;
  subtitle?: string;
}

const props = defineProps({
  items: {
    type: Array as PropType<Array<HubSwitchBtnsItem>>,
  }
});

const selectedItem = defineModel<HubSwitchBtnsItem | null>({
  required: true,
});

const isSelected = (item: HubSwitchBtnsItem) => {
  return isEqual(item, selectedItem.value);
}
</script>

<template>
  <div class="hubSwitchBtns">
    <div
      v-for="item in items"
      :key="item.id"
      @click="selectedItem = item"
      class="hubSwitchBtns_option"
      :class="{ isSelected: isSelected(item) }"
    >
      <p class="title">{{ $t(item.title) }}</p>
      <p v-if="item.subtitle" class="subtitle">{{ `${$t("size")}: ${item.subtitle}` }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubSwitchBtns {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;

  &_option {
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    border-radius: 8px;
    color: $grayColor;
    transition: all 0.2s;
    padding: 8px 12px;
    flex-grow: 1;


    &.isSelected {
      font-weight: 600;
      transform: scale(1.1);
      box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 6px;
      transition: all 0.2s;
    }

    .title {
      text-align: center;
    }

    .subtitle {
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
