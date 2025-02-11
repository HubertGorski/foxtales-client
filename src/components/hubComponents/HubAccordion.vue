<script setup lang="ts">
import { ref, type PropType } from "vue";
import HubAccordionElement from "./HubAccordionElement.vue";

const props = defineProps({
  slotNames: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
});

const openState = ref<number>(-1);

const toggleAccordion = (index: number) => {
  openState.value = openState.value === index ? -1 : index;
};
</script>

<template>
  <div class="hubAccordion">
    <HubAccordionElement
      v-for="(slotName, index) in slotNames"
      :key="index"
      :title="slotName"
      :isOpen="openState === index"
      @toggleAccordion="toggleAccordion(index)"
    >
      <template #default>
        <slot :name="slotName"></slot>
      </template>
    </HubAccordionElement>
  </div>
</template>

<style lang="scss" scoped>
.hubAccordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
