<script setup lang="ts">
import HubInputWithBtn from "./HubInputWithBtn.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
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
  withFoxImg: {
    type: Boolean,
    default: false,
  },
  isTextarea: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: String,
  },
});

const text = defineModel({ type: String, required: true });
</script>

<template>
  <div class="hubInputBox creamCard">
    <img
      v-if="withFoxImg"
      class="hubInputBox_fox"
      src="@/assets/imgs/fox7.webp"
      alt="Lisek"
    />
    <p class="hubInputBox_subtitle">{{ $t(title) }}</p>
    <HubInputWithBtn
      v-model="text"
      :btnAction="btnAction"
      :btnText="btnText"
      :btnIsOrange="btnIsOrange"
      :extraBtnAction="extraBtnAction"
      :extraBtnIcon="extraBtnIcon"
      :extraBtnIsOrange="extraBtnIsOrange"
      :textType="textType"
      :isTextarea="isTextarea"
      :textPlaceholder="textPlaceholder"
      :error-messages="errorMessages"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.hubInputBox {
  position: relative;
  padding: 24px;

  &_fox {
    width: 120px;
    position: absolute;
    top: -48px;
    right: -24px;
  }

  &_subtitle {
    color: $grayColor;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 12px;
  }
}
</style>
