<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import HubShareBtn from '../hubComponents/HubShareBtn.vue';
  import MemoryCard from './MemoryCard.vue';
  import HubPopup from '../hubComponents/HubPopup.vue';
  import { computed } from 'vue';
  import { psychService } from '@/api/services/PsychService';
  import { useLoading } from '@/composables/useLoading';
  import { useUserStore } from '@/stores/userStore';
  import HubPagination from '../hubComponents/HubPagination.vue';
  import NoData from '../NoData.vue';
  import { usePagination } from '@/composables/usePagination';

  const userStore = useUserStore();
  const { loading: isDeleteBtnLoading, withLoading } = useLoading();

  const {
    currentPage,
    totalPages,
    visibleItems,
    isPreviousPageBtnDisabled,
    isNextPageBtnDisabled,
    setPreviousPage,
    setNextPage,
  } = usePagination(() => userStore.user.memories, 1, true);

  const currentMemory = computed(() => visibleItems.value[0] ?? null);

  const removeMemoryFromLibrary = () =>
    withLoading(async () => {
      const result = await psychService.removeMemoryFromLibrary(
        currentMemory.value?.shareKey,
        currentMemory.value?.round,
        userStore.user.userId
      );

      if (!result) {
        return;
      }

      userStore.removeMemory(currentMemory.value?.shareKey, currentMemory.value?.round);
    });

  const isMemoriesCardAvailable = defineModel({ type: Boolean, required: true });
</script>

<template>
  <HubPopup v-model="isMemoriesCardAvailable">
    <div class="shareMemoryPopup">
      <img class="shareMemoryPopup_img" src="@/assets/imgs/memory.webp" alt="Lisek" />
      <p class="shareMemoryPopup_title">{{ $t('yourMemory') }}</p>
      <MemoryCard v-if="currentMemory" :memory="currentMemory" />
      <NoData v-else boxShadow />
      <HubPagination
        v-if="totalPages > 1"
        :paginationText="`${currentPage}/${totalPages}`"
        :isPreviousPageBtnDisabled="isPreviousPageBtnDisabled"
        :isNextPageBtnDisabled="isNextPageBtnDisabled"
        @setPreviousPage="setPreviousPage"
        @setNextPage="setNextPage"
      />
      <div class="shareMemoryPopup_btns">
        <div class="btn">
          <HubBtn
            text="delete"
            :icon="ICON.DELETE"
            :loading="isDeleteBtnLoading"
            :disabled="isDeleteBtnLoading || !currentMemory"
            small
            useGap
            :action="removeMemoryFromLibrary"
          />
        </div>
        <div class="btn">
          <HubShareBtn
            :shareKey="currentMemory?.shareKey"
            :round="currentMemory?.round"
            title="Fox Tales"
            text="Be as sly as a fox!"
          />
        </div>
      </div>
    </div>
  </HubPopup>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .shareMemoryPopup {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    background: $background;
    border-radius: 16px;
    min-width: 360px;
    max-width: 416px;
    box-shadow:
      0 12px 40px rgb(0, 0, 0, 0.18),
      0 2px 8px rgb(0, 0, 0, 0.08);

    &_img {
      height: 132px;
      width: 132px;
      position: absolute;
      top: -74px;
      right: 0;
    }

    &_title {
      font-size: 22px;
      font-weight: 700;
      color: $mainBrownColor;
      letter-spacing: -0.5px;
      padding: 0 8px;
    }

    &_btns {
      display: flex;
      gap: 4px;

      .btn {
        flex: 1;
      }
    }
  }
</style>
