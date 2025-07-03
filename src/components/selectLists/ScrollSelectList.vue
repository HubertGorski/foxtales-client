<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { ListElement } from "./ListElement";
import HubDialogPopup from "../hubComponents/HubDialogPopup.vue";
import { ICON } from "@/enums/iconsEnum";
import { DYLEMATY_CARD_TYPE } from "@/models/DylematyCard";

const props = defineProps({
  addCutomText: {
    type: String,
    required: true,
  },
  createdItemsText: {
    type: String,
    default: "createdItems",
  },
  isTypeAvailable: {
    type: Boolean,
    default: false,
  },
  emptyDataText: {
    type: String,
    default: "emptyData",
  },
});

const emit = defineEmits<{
  (e: "addItems", selectedItems: ListElement[]): void;
  (e: "deleteItems", selectedItems: ListElement[]): void;
}>();

const items = defineModel({
  type: Array as PropType<Array<ListElement>>,
  required: true,
});

const isDeletePopupOpen = ref<boolean>(false);

const isControlPanelVisible = computed(() => {
  return !!items.value.filter((item) => item.isSelected).length;
});

const deleteSelectedItems = () => {
  isDeletePopupOpen.value = true;
};

const addItems = () => {
  emit(
    "addItems",
    items.value.filter((item) => item.isSelected)
  );
};

const deleteItems = () => {
  emit(
    "deleteItems",
    items.value.filter((item) => item.isSelected)
  );
  items.value = items.value.filter((item) => !item.isSelected);
  isDeletePopupOpen.value = false;
};
</script>

<template>
  <div class="scrollSelectList">
    <div class="items" :class="{ isPaddingBottom: isControlPanelVisible }">
      <div v-if="items.length === 0" class="noData">
        <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
        <p>{{ $t(emptyDataText) }}</p>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="item.setSelected(!item.isSelected)"
        :class="{ isSelected: item.isSelected }"
      >
        <div class="itemContent">
          <v-icon class="itemContent_typeIcon" v-if="isTypeAvailable">{{
            item.type === DYLEMATY_CARD_TYPE.POSITIVE ? ICON.HAPPY : ICON.SAD
          }}</v-icon>
          {{ item.description || item.title }}
        </div>
        <v-divider v-if="!item.isSelected" />
      </div>
    </div>
    <div class="infoPanel">{{ $t(createdItemsText) }}: {{ items.length }}</div>
    <div class="controlPanel" :class="{ isVisible: isControlPanelVisible }">
      <div @click="deleteSelectedItems">
        {{ $t("delete") }}
      </div>
      <div @click="addItems">
        {{ $t(addCutomText) }}
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
@import "@/assets/styles/variables";

.scrollSelectList {
  position: relative;
  height: 100%;
  width: 100%;

  .noData {
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: 0.9;
    img {
      padding: 16px 64px;
      width: 100%;
    }
    p {
      color: $mainBrownColor;
      font-weight: 600;
      font-style: italic;
      font-size: 14px;
    }
  }

  .items {
    height: 100%;
    overflow-y: scroll;

    &.isPaddingBottom {
      padding-bottom: 46px;
    }

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
          rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
          rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      }
    }
  }

  .infoPanel {
    background-color: $lightBrownColor;
    color: $whiteColor;
    padding: 4px 8px;
    font-size: 14px;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .controlPanel {
    height: 0;
    position: absolute;
    bottom: 0;
    background-color: $lightBrownColor;
    width: 100%;
    padding: 0;
    color: $whiteColor;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    transition: all 0.4s;

    &.isVisible {
      height: 40px;
      padding: 8px 48px;
    }
  }
}
</style>
