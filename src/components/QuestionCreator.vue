<script setup lang="ts">
import type { Catalog } from "@/models/Catalog";
import WhiteCard from "./WhiteCard.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { computed } from "vue";
import HubBtn from "./hubComponents/HubBtn.vue";

const userStore = useUserStore();

const props = defineProps({
  newQuestion: {
    type: String,
    required: true,
  },
});
const currentUser = userStore.user;
const actualCatalogs = ref<Catalog[]>(currentUser.catalogs);
const currentPage = ref<Number>(2);
const itemsPerPage: number = 4;

const totalPages = computed(() => Math.ceil(actualCatalogs.value.length / itemsPerPage));

const setPreviousPage = () => {
  currentPage.value = currentPage.value - 1;
}

const setNextPage = () => {
  currentPage.value = currentPage.value + 1;

}

const visibleCatalogs = computed(() => {
  const startIndex = (currentPage.value * itemsPerPage) - itemsPerPage;
  return actualCatalogs.value.slice(startIndex, startIndex + itemsPerPage);
})

const libraryPreviousBtn = computed(() => {
  return {
    icon: "mdi-arrow-left-bold-circle-outline",
    disabled: currentPage.value === 1,
    action: () => setPreviousPage(),
  };
});
const libraryNextBtn = computed(() => {
  return {
    icon: "mdi-arrow-right-bold-circle-outline",
    disabled: currentPage.value >= totalPages.value,
    action: () => setNextPage(),
  };
});
</script>

<template>
  <div class="questionCreator creamCard">
    <div class="questionCreator_title">Dodaj do katalogu</div>
    <WhiteCard header="Utworzone pytanie:">
      <div class="question">
        {{ newQuestion }}
      </div>
    </WhiteCard>
    <div class="libraryTitle">Wybrane katalogi (3 / {{ actualCatalogs.length }})</div>
    <div class="library">
      <div class="library_data">
        <div
          v-for="catalog in visibleCatalogs"
          :key="catalog.id"
          class="catalog"
          :class="{ isSelected: catalog.isSelected }"
        >
          <div class="catalog_name">{{ catalog.title }}</div>
          <div
            @click="catalog.isSelected = !catalog.isSelected"
            class="catalog_icon"
          >
            <v-icon v-if="catalog.isSelected">mdi-select-inverse</v-icon>
            <v-icon v-else>mdi-select</v-icon>
          </div>
        </div>
      </div>
      <div class="library_pagination">
        <HubBtn class="btn" :icon="libraryPreviousBtn.icon" :action="libraryPreviousBtn.action" :disabled="libraryPreviousBtn.disabled" />
        <div class="paginationData">{{ currentPage }} / {{ totalPages }} </div>
        <HubBtn class="btn" :icon="libraryNextBtn.icon" :action="libraryNextBtn.action" :disabled="libraryNextBtn.disabled" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.libraryTitle {
  font-style: italic;
  font-size: 14px;
  letter-spacing: 0.1px;
  text-align: end;
  padding-right: 4px;
}
.library {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &_data {
    background-color: #fffefd;
    border: 1px $mainBrownColor solid;
    border-radius: 12px;
    padding: 4px;
    height: 198px;

    .isSelected {
      & .catalog_icon {
        color: #654744;
      }

      & .catalog_name {
        color: $mainBrownColor;
        font-weight: 600;
        &::before {
          background-color: #988482;
        }
      }
    }

    .catalog {
      display: flex;
      gap: 4px;

      &_name {
        padding: 0 8px;
        display: flex;
        align-items: center;
        flex-grow: 1;
        position: relative;
        color: $grayColor;
        font-style: italic;
        font-size: 16px;
        letter-spacing: 0.1px;
        &::before {
          position: absolute;
          bottom: 14px;
          content: "";
          height: 1px;
          width: 100%;
          background-color: #ccc2c1;
        }
      }
      
      &_icon {
        border-radius: 4px;
        color: $lightGrayColor;
        margin: 8px;
        font-size: 20px;
      }
    }
  }
  &_pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffefd;
    border: 1px $mainBrownColor solid;
    border-radius: 12px;

    .btn {
      font-size: 20px;
      padding: 4px;
      width: min-content;
    }
  }

  .paginationData {
    color: $mainBrownColor;
    font-weight: 600;
  }
}

.questionCreator {
  width: 324px;
  padding: 12px;

  &_title {
    color: $grayColor;
    font-size: 24px;
    font-weight: 600;
  }

  .question {
    font-size: 14px;
    font-style: italic;
    color: $lightGrayColor;
    letter-spacing: 0.5px;
  }
}
</style>
