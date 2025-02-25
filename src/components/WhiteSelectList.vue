<script setup lang="ts">
import { ICON } from "@/enums/iconsEnum";
import { computed, ref, type PropType } from "vue";
import HubBtn from "./hubComponents/HubBtn.vue";
import HubTooltip from "./hubComponents/HubTooltip.vue";

interface listElement {
  id: number;
  title: string;
  description: string;
  isSelected: boolean;
}

const items = defineModel({ type: Array as PropType<Array<listElement>>, required: true });

const actualItems = ref(items);
const currentPage = ref<number>(1);
const itemsPerPage: number = 4;

const visibleItems = computed(() => {
  const startIndex = currentPage.value * itemsPerPage - itemsPerPage;
  return actualItems.value.slice(startIndex, startIndex + itemsPerPage);
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

const totalPages = computed(() =>
  Math.ceil(actualItems.value.length / itemsPerPage)
);

const selectedItems = computed(() =>
  actualItems.value.filter((item) => item.isSelected)
);

const setPreviousPage = () => {
  currentPage.value = currentPage.value - 1;
};

const setNextPage = () => {
  currentPage.value = currentPage.value + 1;
};
</script>

<template>
  <div class="whiteSelectList">
    <div class="whiteSelectList_selectedCount">
      Wybrane katalogi ({{ selectedItems.length }} / {{ actualItems.length }})
    </div>
    <div class="whiteSelectList_data">
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
          <div class="item_name">{{ item.title }}</div>
        </HubTooltip>
        <div @click="item.isSelected = !item.isSelected" class="item_icon">
          <v-icon v-if="item.isSelected">{{ ICON.SELECT_ON }}</v-icon>
          <v-icon v-else>{{ ICON.SELECT_OFF }}</v-icon>
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="pagination">
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
@import "@/assets/styles/variables";

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
    height: 198px;

    .isSelected {
      & .item_icon {
        color: #654744;
      }

      & .item_name {
        color: $mainBrownColor;
        font-weight: 600;
        &::before {
          background-color: #988482;
        }
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
      }

      &::before {
        position: absolute;
        bottom: 14px;
        left: 8px;
        content: "";
        height: 1px;
        width: 80%;
        background-color: #ccc2c1;
      }

      &_icon {
        border-radius: 4px;
        color: $lightGrayColor;
        margin: 8px;
        font-size: 20px;
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
