<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { computed } from 'vue';
  import HubBtn from './HubBtn.vue';

  const {
    paginationText,
    isPreviousPageBtnDisabled = false,
    isNextPageBtnDisabled = false,
  } = defineProps<{
    paginationText?: string;
    isPreviousPageBtnDisabled?: boolean;
    isNextPageBtnDisabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'setPreviousPage'): void;
    (e: 'setNextPage'): void;
  }>();

  const previousPageBtn = computed(() => {
    return {
      icon: ICON.ARROW_LEFT,
      disabled: isPreviousPageBtnDisabled,
      action: () => setPreviousPage(),
    };
  });
  const nextPageBtn = computed(() => {
    return {
      icon: ICON.ARROW_RIGHT,
      disabled: isNextPageBtnDisabled,
      action: () => setNextPage(),
    };
  });

  const setPreviousPage = () => {
    emit('setPreviousPage');
  };

  const setNextPage = () => {
    emit('setNextPage');
  };
</script>

<template>
  <div class="hubPagination">
    <HubBtn
      class="hubPagination_btn"
      :icon="previousPageBtn.icon"
      :action="previousPageBtn.action"
      :disabled="previousPageBtn.disabled"
    />
    <div class="hubPagination_data">{{ paginationText }}</div>
    <HubBtn
      class="hubPagination_btn"
      :icon="nextPageBtn.icon"
      :action="nextPageBtn.action"
      :disabled="nextPageBtn.disabled"
    />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .hubPagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffefd;
    border: 1px $mainBrownColor solid;
    border-radius: 12px;
    margin-top: 4px;

    &_btn {
      font-size: 20px;
      padding: 4px;
      width: min-content;
    }

    &_data {
      color: $mainBrownColor;
      font-weight: 600;
    }
  }
</style>
