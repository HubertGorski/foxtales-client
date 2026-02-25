<script setup lang="ts">
  import { computed } from 'vue';
  import HubBtn from './HubBtn.vue';
  import { useI18n } from 'vue-i18n';
  import HubInput from './HubInput.vue';

  const props = defineProps({
    btnText: {
      type: String,
      required: true,
    },
    btnIsOrange: {
      type: Boolean,
    },
    btnIsDisabled: {
      type: Boolean,
      default: false,
    },
    btnAction: {
      type: Function,
      required: true,
    },
    extraBtnIsDisabled: {
      type: Boolean,
      required: false,
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
    textareaRows: {
      type: Number,
      default: 2,
    },
    dictsDisabled: {
      type: Boolean,
      default: false,
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: String,
    },
  });

  const { t } = useI18n();
  const text = defineModel({ type: String, required: true });

  const emit = defineEmits<{
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>();

  const handleFocus = () => {
    emit('focus');
  };

  const handleBlur = (event: FocusEvent) => {
    const related = event.relatedTarget as HTMLElement | null;
    if (related && related.closest('[data-no-blur]')) {
      return;
    }

    // Safari
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active && active.closest('[data-no-blur]')) return;
      emit('blur');
    }, 0);
  };

  const btnIsDisabled = computed(() => {
    if (!text.value) {
      return true;
    }

    return text.value.length === 0 || props.btnIsDisabled;
  });

  const actualTextPlaceholder = computed(() => {
    if (!props.textPlaceholder) {
      return '';
    }

    return props.dictsDisabled ? props.textPlaceholder : t(props.textPlaceholder);
  });

  const handleEnter = (e: KeyboardEvent) => {
    if (!btnIsDisabled.value) {
      props.btnAction(e);
    } else {
      e.preventDefault();
    }
  };
</script>

<template>
  <div class="hubInputWithBtn">
    <HubInput
      v-model="text"
      :isTextarea="isTextarea"
      :textareaRows="textareaRows"
      :placeholder="actualTextPlaceholder"
      :textType="textType"
      :errorMessages="errorMessages"
      :inputDisabled="inputDisabled"
      @enter="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <slot></slot>
    <div class="hubInputWithBtn_controls">
      <HubBtn
        class="btn mainBtn"
        :action="btnAction"
        :text="btnText"
        :isOrange="btnIsOrange"
        :disabled="btnIsDisabled"
        :loading="btnLoading"
      />
      <HubBtn
        v-if="extraBtnAction && extraBtnIcon"
        class="btn"
        :action="extraBtnAction"
        :icon="extraBtnIcon"
        :disabled="extraBtnIsDisabled"
        :isOrange="extraBtnIsOrange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubInputWithBtn {
    display: flex;
    flex-direction: column;

    &_controls {
      display: flex;
      justify-content: center;
      gap: 4px;

      .btn {
        padding: 6px;
        margin-top: 12px;
        width: auto;

        &.mainBtn {
          flex-grow: 1;
        }
      }
    }
  }
</style>
