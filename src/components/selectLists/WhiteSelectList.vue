<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { computed, watch, type PropType } from 'vue';
  import HubTooltip from '../hubComponents/HubTooltip.vue';
  import type { ListElement } from './ListElement';
  import HubPagination from '../hubComponents/HubPagination.vue';
  import NoData from '../NoData.vue';
  import { usePagination } from '@/composables/usePagination';

  const {
    showSelectedCount = false,
    customSelectedCountTitle = 'selectedItems',
    multiple = false,
    showPagination = false,
    showElementsCountInItem = false,
    height,
    itemsPerPage = 4,
    showItemDetailsBtn = false,
    emptyDataText = 'emptyData',
    selectVisibleItems = false,
    moveToSelectedItem = false,
    minimalView = false,
    selectItemId,
    infinityPages = false,
  } = defineProps<{
    showSelectedCount?: boolean;
    customSelectedCountTitle?: string;
    multiple?: boolean;
    showPagination?: boolean;
    showElementsCountInItem?: boolean;
    height?: number;
    itemsPerPage?: number;
    showItemDetailsBtn?: boolean;
    emptyDataText?: string;
    selectVisibleItems?: boolean;
    moveToSelectedItem?: boolean;
    minimalView?: boolean;
    selectItemId?: number;
    infinityPages?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'showDetails', item: ListElement): void;
  }>();

  const items = defineModel({
    type: Array as PropType<Array<ListElement>>,
    required: true,
  });

  const {
    currentPage,
    totalPages,
    visibleItems,
    isPreviousPageBtnDisabled,
    isNextPageBtnDisabled,
    setPreviousPage,
    setNextPage,
    moveToItem,
  } = usePagination(() => items.value, itemsPerPage, infinityPages);

  if (selectItemId) {
    const selectItem = items.value.find(i => i.id === selectItemId);
    if (selectItem) {
      selectItem.isSelected = true;
    }
  }

  if (moveToSelectedItem) {
    moveToItem(items.value.findIndex(i => i.isSelected));
  }

  const selectedItems = computed(() => items.value.filter(item => item.isSelected));

  const paginationText = computed(() => {
    if (minimalView) {
      return visibleItems.value.length > 0 ? visibleItems.value[0].title : '';
    }

    return `${currentPage.value} / ${totalPages.value}`;
  });

  const showDetails = (item: ListElement) => {
    emit('showDetails', item);
  };

  const selectItem = (item: ListElement) => {
    if (multiple) {
      item.isSelected = !item.isSelected;
    } else {
      items.value.map(item => (item.isSelected = false));
      item.isSelected = true;
    }
  };
  watch(visibleItems, () => {
    if (!selectVisibleItems) {
      return;
    }

    items.value.forEach(item => {
      item.isSelected = false;
    });

    visibleItems.value.forEach(item => {
      item.isSelected = true;
    });
  });

  if (selectVisibleItems) {
    visibleItems.value.forEach(item => {
      item.isSelected = true;
    });
  }
</script>

<template>
  <div class="whiteSelectList">
    <div v-if="!minimalView">
      <div
        v-if="showSelectedCount && visibleItems.length > 0"
        class="whiteSelectList_selectedCount"
      >
        {{ $t(customSelectedCountTitle) }} ({{ selectedItems.length }} / {{ items.length }})
      </div>
      <NoData v-if="visibleItems.length === 0" :emptyDataText="emptyDataText" />
      <div
        v-else
        class="whiteSelectList_data"
        :style="totalPages > 1 ? { height: height + 'px' } : {}"
      >
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="item"
          :class="{ isSelected: item.isSelected }"
        >
          <HubTooltip
            :tooltipText="item.description"
            :tooltipDisabled="!item.description"
            maxWidth
            dictsDisabled
          >
            <div class="item_name">
              <div v-if="showElementsCountInItem" class="elementsCount">
                ({{ item.elementsCount }}/{{ item.size }})
              </div>
              {{ item.title }}
            </div>
          </HubTooltip>
          <div v-if="showItemDetailsBtn" class="item_actionIcon" @click="showDetails(item)">
            <v-icon>{{ ICON.EDIT_COLLECTION }}</v-icon>
          </div>
          <div v-else class="item_icon" @click="selectItem(item)">
            <v-icon v-if="item.isSelected">{{ ICON.SELECT_ON }}</v-icon>
            <v-icon v-else>{{ ICON.SELECT_OFF }}</v-icon>
          </div>
        </div>
      </div>
    </div>
    <NoData
      v-if="visibleItems.length === 0 && minimalView"
      :emptyDataText="emptyDataText"
      boxShadow
    />
    <HubPagination
      v-if="
        (!minimalView && showPagination && totalPages > 1) ||
        (minimalView && showPagination && totalPages > 0)
      "
      :paginationText="paginationText"
      :isPreviousPageBtnDisabled="isPreviousPageBtnDisabled"
      :isNextPageBtnDisabled="isNextPageBtnDisabled"
      @setPreviousPage="setPreviousPage"
      @setNextPage="setNextPage"
    />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .whiteSelectList {
    &_selectedCount {
      font-style: italic;
      font-size: 14px;
      letter-spacing: 0.1px;
      text-align: end;
      padding-right: 4px;
    }

    &_data {
      background-color: #fffefd;
      border: 1px $mainBrownColor solid;
      border-radius: 12px;
      padding: 4px;

      .isSelected {
        & .item_icon {
          color: $lightBrownColor;
        }

        & .item_name {
          color: $mainBrownColor;
          font-weight: 600;
        }

        &.item::before {
          background-color: #988482;
        }
      }

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &_name {
          padding: 0 8px;
          color: $grayColor;
          font-style: italic;
          font-size: 16px;
          letter-spacing: 0.1px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 242px;

          .elementsCount {
            font-size: 12px;
            display: inline-block;
            bottom: 1px;
            position: relative;
          }
        }

        &::before {
          position: absolute;
          bottom: 14px;
          left: 8px;
          content: '';
          height: 1px;
          width: 80%;
          background-color: #ccc2c1;
        }

        &_icon {
          cursor: pointer;
          border-radius: 4px;
          color: $lightGrayColor;
          margin: 8px;
          font-size: 20px;
        }

        &_actionIcon {
          font-size: 20px;
          margin: 8px;
          color: $lightBrownColor;
        }
      }
    }
  }
</style>
