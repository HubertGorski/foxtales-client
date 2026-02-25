<script setup lang="ts">
  const {
    isTextarea = false,
    inputDisabled = false,
    textareaRows = 2,
    placeholder,
    textType,
    errorMessages,
  } = defineProps<{
    isTextarea?: boolean;
    inputDisabled?: boolean;
    textareaRows?: number;
    placeholder: string;
    textType?: string;
    errorMessages?: string;
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
      :placeholder="placeholder"
      :error-messages="errorMessages"
      :hide-details="!errorMessages"
      :disabled="inputDisabled"
      no-resize
      @keydown.enter="handleEnter"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <v-text-field
      v-else
      v-model="text"
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
