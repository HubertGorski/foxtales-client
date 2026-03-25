<script setup lang="ts">
  import { computed, ref, type PropType } from 'vue';
  import type { ListElement } from './ListElement';
  import HubDialogPopup from '../hubComponents/HubDialogPopup.vue';
  import NoData from '../NoData.vue';

  const {
    addCutomText,
    createdItemsText = 'createdItems',
    emptyDataText = 'emptyData',
  } = defineProps<{
    addCutomText: string;
    createdItemsText?: string;
    emptyDataText?: string;
  }>();

  const emit = defineEmits<{
    (e: 'addItems', selectedItems: ListElement[]): void;
    (e: 'deleteItems', selectedItems: ListElement[]): void;
  }>();

  const items = defineModel({
    type: Array as PropType<Array<ListElement>>,
    required: true,
  });

  const isDeletePopupOpen = ref<boolean>(false);

  const isControlPanelVisible = computed(() => {
    return !!items.value.filter(item => item.isSelected).length;
  });

  const deleteSelectedItems = () => {
    isDeletePopupOpen.value = true;
  };

  const addItems = () => {
    emit(
      'addItems',
      items.value.filter(item => item.isSelected)
    );
  };

  const deleteItems = () => {
    emit(
      'deleteItems',
      items.value.filter(item => item.isSelected)
    );
    isDeletePopupOpen.value = false;
  };
</script>

<template>
  <div class="scrollSelectList">
    <div class="items">
      <NoData v-if="items.length === 0" :emptyDataText="emptyDataText" big />
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ isSelected: item.isSelected }"
        @click="item.setSelected(!item.isSelected)"
      >
        <div class="itemContent">
          {{ item.description || item.title }}
        </div>
        <v-divider v-if="!item.isSelected" />
      </div>
    </div>
    <div class="panelsWrapper">
      <div class="panel infoPanel">{{ $t(createdItemsText) }}: {{ items.length }}</div>
      <div class="panel controlPanel" :class="{ isVisible: isControlPanelVisible }">
        <div class="action-item" @click="deleteSelectedItems">
          {{ $t('delete') }}
        </div>
        <div class="action-item" @click="addItems">
          {{ $t(addCutomText) }}
        </div>
      </div>
    </div>
    <HubDialogPopup
      v-model="isDeletePopupOpen"
      :textPopup="$t('confirmDeleteItemsTextPopup')"
      :confirmAction="deleteItems"
    />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .scrollSelectList {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    .items {
      flex: 1;
      overflow-y: auto;
      transition: padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background-color: $background;

      .item {
        font-size: 14px;
        padding: 4px 8px;
        color: $grayColor;
        transition: all 0.3s;

        .itemContent {
          display: flex;

          &_typeIcon {
            font-size: 24px;
            padding: 8px 16px;
          }
        }

        &.isSelected {
          background-color: $whiteColor;
          margin: 4px;
          border-radius: 8px;
          box-shadow:
            rgb(0, 0, 0, 0.05) 0 6px 24px 0,
            rgb(0, 0, 0, 0.08) 0 0 0 1px;
        }
      }
    }

    .panelsWrapper {
      position: sticky;
      width: 100%;
      background-color: $lightBrownColor;
      z-index: 2;
      box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
    }

    .panel {
      color: $whiteColor;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 4px 16px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .infoPanel {
      font-size: 13px;
      justify-content: center;
      min-height: 28px;
    }

    .controlPanel {
      height: 0;
      opacity: 0;
      overflow: hidden;
      justify-content: space-between;
      padding: 0 48px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);

      &.isVisible {
        height: 46px;
        padding: 8px 48px;
        opacity: 1;
      }

      .action-item {
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
</style>
