<script setup lang="ts">
import { type PropType } from "vue";
import HubAccordionElement from "./HubAccordionElement.vue";
import HubDivider from "./HubDivider.vue";
import IsComing from "../IsComing.vue";

const props = defineProps({
  slotNames: {
    type: Array as PropType<Array<{ slotName: string; isComing: boolean }>>,
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
const setOpenTab = defineModel({ type: String, default: "" });

const toggleAccordion = (slotName: string) => {
  setOpenTab.value = setOpenTab.value === slotName ? "" : slotName;
};

const showDivider = (index: number) => {
  return props.isDividerVisible && index !== props.slotNames.length - 1;
};
</script>

<template>
  <div v-for="(slot, index) in slotNames" :key="index" class="hubAccordion">
    <HubAccordionElement
      :key="index"
      :title="slot.slotName"
      :isOpen="setOpenTab === slot.slotName"
      :isSmallerTitle="isSmallerTitle"
      withStatusIcon
      @toggleAccordion="toggleAccordion(slot.slotName)"
    >
      <template #default>
        <IsComing :isEnabled="slot.isComing">
          <slot :name="slot.slotName"></slot>
        </IsComing>
      </template>
    </HubAccordionElement>
    <HubDivider v-if="showDivider(index)" :text="$t('or')" />
  </div>
</template>

<style lang="scss" scoped>
.hubAccordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
