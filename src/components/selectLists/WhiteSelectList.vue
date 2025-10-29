<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { computed, ref, watch, type PropType } from 'vue';
  import HubTooltip from '../hubComponents/HubTooltip.vue';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import type { ListElement } from './ListElement';

  const props = defineProps({
    showSelectedCount: {
      type: Boolean,
      default: false,
    },
    customSelectedCountTitle: {
      type: String,
      default: 'selectedItems',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    showElementsCountInItem: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      required: false,
    },
    itemsPerPage: {
      type: Number,
      default: 4,
    },
    showItemDetailsBtn: {
      type: Boolean,
      default: false,
    },
    emptyDataText: {
      type: String,
      default: 'emptyData',
    },
    selectVisibleItems: {
      type: Boolean,
      default: false,
    },
    moveToSelectedItem: {
      type: Boolean,
      default: false,
    },
    selectItemId: {
      type: Number,
      required: false,
    },
  });

  const emit = defineEmits<{
    (e: 'showDetails', item: ListElement): void;
  }>();

  const items = defineModel({
    type: Array as PropType<Array<ListElement>>,
    required: true,
  });
  const currentPage = ref<number>(1);

  if (props.selectItemId) {
    const selectItem = items.value.find(i => i.id === props.selectItemId);
    if (selectItem) {
      selectItem.isSelected = true;
    }
  }

  if (props.moveToSelectedItem) {
    const firstSelectedIndex = items.value.findIndex(i => i.isSelected);
    if (firstSelectedIndex !== -1) {
      currentPage.value = Math.floor(firstSelectedIndex / props.itemsPerPage) + 1;
    }
  }

  const visibleItems = computed(() => {
    const startIndex = currentPage.value * props.itemsPerPage - props.itemsPerPage;
    return items.value.slice(startIndex, startIndex + props.itemsPerPage);
  });

  const previousPageBtn = computed(() => {
    return {
      icon: ICON.ARROW_LEFT,
      disabled: currentPage.value === 1,
      action: () => setPreviousPage(),
    };
  });
  const nextPageBtn = computed(() => {
    return {
      icon: ICON.ARROW_RIGHT,
      disabled: currentPage.value >= totalPages.value,
      action: () => setNextPage(),
    };
  });

  const totalPages = computed(() => Math.ceil(items.value.length / props.itemsPerPage));

  const selectedItems = computed(() => items.value.filter(item => item.isSelected));

  const setPreviousPage = () => {
    currentPage.value = currentPage.value - 1;
  };

  const setNextPage = () => {
    currentPage.value = currentPage.value + 1;
  };

  const showDetails = (item: ListElement) => {
    emit('showDetails', item);
  };

  const selectItem = (item: ListElement) => {
    if (props.multiple) {
      item.isSelected = !item.isSelected;
    } else {
      items.value.map(item => (item.isSelected = false));
      item.isSelected = true;
    }
  };
  watch(visibleItems, () => {
    if (!props.selectVisibleItems) {
      return;
    }

    items.value.forEach(item => {
      item.isSelected = false;
    });

    visibleItems.value.forEach(item => {
      item.isSelected = true;
    });
  });

  if (props.selectVisibleItems) {
    visibleItems.value.forEach(item => {
      item.isSelected = true;
    });
  }
</script>

<template>
  <div class="whiteSelectList">
    <div v-if="showSelectedCount && visibleItems.length > 0" class="whiteSelectList_selectedCount">
      {{ $t(customSelectedCountTitle) }} ({{ selectedItems.length }} / {{ items.length }})
    </div>
    <div v-if="visibleItems.length === 0" class="noData">
      <img src="@/assets/imgs/fox-icon.webp" alt="Lisek" />
      <p>{{ $t(emptyDataText) }}</p>
    </div>
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
    <div v-if="totalPages > 1 && showPagination" class="pagination">
      <HubBtn
        class="pagination_btn"
        :icon="previousPageBtn.icon"
        :action="previousPageBtn.action"
        :disabled="previousPageBtn.disabled"
      />
      <div class="pagination_data">{{ currentPage }} / {{ totalPages }}</div>
      <HubBtn
        class="pagination_btn"
        :icon="nextPageBtn.icon"
        :action="nextPageBtn.action"
        :disabled="nextPageBtn.disabled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .whiteSelectList {
    &_selectedCount {
      font-style: italic;
      font-size: 14px;
      letter-spacing: 0.1px;
      text-align: end;
      padding-right: 4px;
    }

    .noData {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 4px 8px;
      opacity: 0.9;
      img {
        width: 64px;
      }
      p {
        color: $mainBrownColor;
        font-weight: 600;
        font-style: italic;
        font-size: 14px;
      }
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
    .pagination {
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
  }
</style>
