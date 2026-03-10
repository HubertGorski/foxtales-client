<script setup lang="ts">
  const {
    isTextarea = false,
    inputDisabled = false,
    textareaRows = 2,
    textType,
    label,
    placeholder,
    errorMessages,
    noResize = true,
  } = defineProps<{
    isTextarea?: boolean;
    inputDisabled?: boolean;
    textareaRows?: number;
    label?: string;
    placeholder?: string;
    textType?: string;
    errorMessages?: string;
    noResize?: boolean;
  }>();

  const text = defineModel({ type: String, required: true });

  const emit = defineEmits<{
    (e: 'focus'): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'enter', event: KeyboardEvent): void;
  }>();

  const handleFocus = () => {
    emit('focus');
  };

  const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
  };

  const handleEnter = (event: KeyboardEvent) => {
    emit('enter', event);
  };
</script>

<template>
  <div class="hubInput">
    <v-textarea
      v-if="isTextarea"
      v-model="text"
      :auto-grow="false"
      :rows="textareaRows"
      :label="label"
      :placeholder="placeholder"
      :error-messages="errorMessages"
      :hide-details="!errorMessages"
      :disabled="inputDisabled"
      :no-resize="noResize"
      @keydown.enter="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <v-text-field
      v-else
      v-model="text"
      :label="label"
      :placeholder="placeholder"
      :type="textType"
      :error-messages="errorMessages"
      :hide-details="!errorMessages"
      :disabled="inputDisabled"
      @keydown.enter="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>
