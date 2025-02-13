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
  extraBtnIsOrange: {
    type: Boolean,
    required: false,
  },
  extraBtnAction: {
    type: Function,
    required: false,
  },
  extraBtnIcon: {
    type: String,
    required: false,
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
      hide-details
    />
    <v-text-field
      v-else
      v-model="text"
      hide-details
      @keydown.enter="btnAction"
      :placeholder="textPlaceholder ? $t(textPlaceholder) : ''"
      :type="textType"
    />
    <div class="hubInputWithBtn_controls">
      <HubBtn
        class="btn mainBtn"
        :action="btnAction"
        :text="btnText"
        :isOrange="btnIsOrange"
        :disabled="btnIsDisabled"
      />
      <HubBtn
      v-if="extraBtnAction && extraBtnIcon"
        class="btn"
        :action="extraBtnAction"
        :icon="extraBtnIcon"
        :disabled="btnIsDisabled"
        :isOrange="extraBtnIsOrange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubInputWithBtn {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &_controls {
    display: flex;
    gap: 4px;

    .btn {
      padding: 6px;
      width: auto;
      &.mainBtn {
        flex-grow: 1;
      }
    }
  }
}
</style>
