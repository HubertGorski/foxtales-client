<script setup lang="ts">
import { type PropType } from "vue";
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
});
const setOpenTab = defineModel({ type: String, default: '' });

const toggleAccordion = (slotName: string) => {
  setOpenTab.value = setOpenTab.value === slotName ? '' : slotName;
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
      :isOpen="setOpenTab === slotName"
      :isSmallerTitle="isSmallerTitle"
      withStatusIcon
      @toggleAccordion="toggleAccordion(slotName)"
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
