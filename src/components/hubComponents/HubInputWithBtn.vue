<script setup lang="ts">
import { computed, ref } from "vue";
import HubBtn from "./HubBtn.vue";

const props = defineProps({
  btnText: {
    type: String,
    required: true,
  },
  btnIsOrange: {
    type: Boolean,
  },
  btnAction: {
    type: Function,
    required: true,
  },
  textPlaceholder: {
    type: String,
  },
  textType: {
    type: String,
  },
  isTextarea: {
    type: Boolean,
    default: false,
  },
});

const text = defineModel({ type: String, required: true });

const btnIsDisabled = computed(() => {
  return text.value.length === 0;
});
</script>

<template>
  <div class="hubInputWithBtn">
    <v-textarea
      v-if="isTextarea"
      v-model="text"
      @keydown.enter="btnAction"
      :auto-grow="false"
    />
    <v-text-field
      v-else
      v-model="text"
      hide-details
      @keydown.enter="btnAction"
      :placeholder="textPlaceholder ? $t(textPlaceholder) : ''"
      :type="textType"
    />
    <HubBtn
      class="hubInputWithBtn_btn"
      :action="btnAction"
      :text="btnText"
      :isOrange="btnIsOrange"
      :disabled="btnIsDisabled"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubInputWithBtn {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &_btn {
    padding: 6px;
    width: auto;
  }
}
</style>
