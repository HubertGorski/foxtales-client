<script setup lang="ts">
import { ref, type PropType } from "vue";
import HubAccordionElement from "./HubAccordionElement.vue";
import HubDivider from "./HubDivider.vue";

const props = defineProps({
  slotNames: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
  isSmallerTitle: {
    type: Boolean,
    default: false,
  },
  isDividerVisible: {
    type: Boolean,
    default: false,
  },
  setOpenTab: {
    type: String,
    default: "",
  },
});

const openStateFirst = props.setOpenTab
  ? props.slotNames.indexOf(props.setOpenTab)
  : -1;
const openState = ref<number>(openStateFirst);
const toggleAccordion = (index: number) => {
  openState.value = openState.value === index ? -1 : index;
};

const showDivider = (index: number) => {
  return props.isDividerVisible && index !== props.slotNames.length - 1;
};
</script>

<template>
  <div v-for="(slotName, index) in slotNames" :key="index" class="hubAccordion">
    <HubAccordionElement
      :key="index"
      :title="slotName"
      :isOpen="openState === index"
      :isSmallerTitle="isSmallerTitle"
      withStatusIcon
      @toggleAccordion="toggleAccordion(index)"
    >
      <template #default>
        <slot :name="slotName"></slot>
      </template>
    </HubAccordionElement>
    <HubDivider v-if="showDivider(index)" />
  </div>
</template>

<style lang="scss" scoped>
.hubAccordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
