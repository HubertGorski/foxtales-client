<script setup lang="ts">
  interface Action {
    text: string;
    action: () => void;
  }

  defineProps<{
    actions: Action[];
  }>();
</script>

<template>
  <div class="hubSubActions">
    <template v-for="(item, index) in actions" :key="index">
      <span class="hubSubActions_link" @click="item.action()">
        {{ $t(item.text) }}
      </span>
      <div v-if="index < actions.length - 1" class="hubSubActions_spacer"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubSubActions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba($mainBrownColor, 0.05);
    width: 100%;

    &_link {
      font-size: 14px;
      font-weight: 600;
      color: rgba($mainBrownColor, 0.6);
      cursor: pointer;
      padding: 4px 10px;
      transition: all 0.2s ease;
      text-align: center;

      &:hover {
        color: $mainOrangeColor;
      }

      &:active {
        transform: scale(0.98);
        opacity: 0.8;
      }
    }

    &_spacer {
      width: 1px;
      height: 14px;
      background: rgba($mainBrownColor, 0.15);
      margin: 0 4px;
    }
  }
</style>
