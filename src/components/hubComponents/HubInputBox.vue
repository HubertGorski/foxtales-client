<script setup lang="ts">
  import HubInputWithBtn from './HubInputWithBtn.vue';

  const {
    title,
    btnText,
    btnIsOrange = false,
    btnAction,
    extraBtnIsOrange = false,
    extraBtnAction,
    extraBtnIcon,
    textPlaceholder,
    textType,
    withFoxImg = false,
    isTextarea = false,
    errorMessages,
    btnLoading = false,
  } = defineProps<{
    title: string;
    btnText: string;
    btnAction: () => void;
    btnIsOrange?: boolean;
    extraBtnIsOrange?: boolean;
    extraBtnAction?: () => void;
    extraBtnIcon?: string;
    textPlaceholder?: string;
    textType?: string;
    withFoxImg?: boolean;
    isTextarea?: boolean;
    errorMessages?: string;
    btnLoading?: boolean;
  }>();

  const text = defineModel({ type: String, required: true });

  const emit = defineEmits<{
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>();

  const handleFocus = () => {
    emit('focus');
  };

  const handleBlur = () => {
    emit('blur');
  };
</script>

<template>
  <div class="hubInputBox creamCard">
    <img v-if="withFoxImg" class="hubInputBox_fox" src="@/assets/imgs/fox7.webp" alt="Lisek" />
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
      :btnLoading="btnLoading"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <slot></slot>
    </HubInputWithBtn>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

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
