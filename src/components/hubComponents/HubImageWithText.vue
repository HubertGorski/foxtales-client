<script setup lang="ts">
  const props = defineProps({
    imageSrc: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <div class="hubImageWithText">
    <img :src="props.imageSrc" :alt="props.alt" />
    <p class="hubImageWithText_text">
      {{ props.text }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubImageWithText {
    font-size: 16px;
    font-weight: 600;
    color: $grayColor;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-grow: 1;

    &_text {
      text-align: center;
      background-color: $infoBackgroundColor;
      border-radius: 8px;
      padding: 12px 8px;
    }

    img {
      max-width: 300px;
      max-height: 300px;
    }
  }
</style>
