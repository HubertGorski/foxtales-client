<script setup lang="ts">
  const { title, mainIcon, text, subtext, icon } = defineProps<{
    title: string;
    mainIcon: string;
    text: string;
    subtext: string;
    icon?: string;
  }>();
</script>

<template>
  <div class="infoGame">
    <div class="infoGame_title">
      <v-icon>{{ mainIcon }}</v-icon>
      <span>{{ title }}</span>
    </div>
    <span class="infoGame_count" :class="{ 'infoGame_count--long': text.length > 8 }">
      {{ text }}
    </span>
    <div v-if="subtext" class="infoGame_preferCount">
      <v-icon v-if="icon">{{ icon }}</v-icon>
      <span>{{ subtext }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .infoGame {
    flex-grow: 1;
    background: rgba($darkBackground, 0.25);
    box-shadow:
      rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    align-items: center;
    color: $mainBrownColor;
    padding: 8px;

    &_title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 4px;

      .v-icon {
        color: $mainOrangeColor;
      }

      span {
        font-size: 14px;
        line-height: 14px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
    }

    &_count {
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      text-align: center;

      &--long {
        font-size: 18px;
        line-height: 1.2;
      }
    }

    &_preferCount {
      font-size: 0.75rem;
      line-height: 1rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
  }
</style>
