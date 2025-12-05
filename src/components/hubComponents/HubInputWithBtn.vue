<script setup lang="ts">
  import { computed } from 'vue';
  import HubBtn from './HubBtn.vue';
  import { useI18n } from 'vue-i18n';

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

    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 150);

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
    <v-textarea
      v-if="isTextarea"
      v-model="text"
      :auto-grow="false"
      :rows="textareaRows"
      :placeholder="actualTextPlaceholder"
      :error-messages="errorMessages"
      :hide-details="!errorMessages"
      no-resize
      @keydown.enter="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <v-text-field
      v-else
      v-model="text"
      :placeholder="actualTextPlaceholder"
      :type="textType"
      :error-messages="errorMessages"
      :hide-details="!errorMessages"
      @keydown.enter="handleEnter"
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
  @import '@/assets/styles/variables';

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
