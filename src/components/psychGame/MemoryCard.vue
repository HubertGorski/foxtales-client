<script setup lang="ts">
  import type { Memory } from '@/models/Memory';

  const { memory } = defineProps<{
    memory: Memory;
  }>();
</script>

<template>
  <div class="memoryCard">
    <div class="memoryCard_question">{{ memory.currentQuestion.text }}</div>
    <div class="memoryCard_answers">
      <div v-for="(answer, index) in memory.memoryAnswers" :key="index" class="answer">
        <div v-if="!memory.areUsersHidden" class="answer_username">{{ answer.ownerUsername }}:</div>
        <div class="answer_text">{{ answer.text }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .memoryCard {
    background: $mainBackground;
    border-radius: 16px;
    padding: 12px;
    max-width: 380px;
    min-width: 320px;

    &_question {
      font-size: 15px;
      font-weight: 500;
      color: $mainBrownColor;
      background: rgba($background, 0.7);
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 1rem;
      line-height: 1.5;
      border: 0.5px solid rgba($mainBrownColor, 0.15);
    }

    &_answers {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 50dvh;
      overflow-y: auto;
    }
  }

  .answer {
    display: flex;
    align-items: baseline;
    gap: 8px;
    background: rgba($background, 0.55);
    border-radius: 10px;
    padding: 8px 16px;
    border: 0.5px solid rgba($mainBrownColor, 0.12);

    &_username {
      font-size: 12px;
      font-weight: 500;
      color: $darkOrangeColor;
      white-space: nowrap;
    }

    &_text {
      font-size: 14px;
      color: $mainBrownColor;
      line-height: 1.5;
    }
  }
</style>
