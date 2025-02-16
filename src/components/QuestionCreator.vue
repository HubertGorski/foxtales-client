<script setup lang="ts">
import type { Catalog } from "@/models/Catalog";
import WhiteCard from "./WhiteCard.vue";
import { ref } from "vue";
import { catalogs } from "@/assets/data/catalogs";

const props = defineProps({
  newQuestion: {
    type: String,
    required: true,
  },
});

const actualCatalogs = ref<Catalog[]>(catalogs);
</script>

<template>
  <div class="questionCreator creamCard">
    <div class="questionCreator_title">Dodaj do katalogu</div>
    <WhiteCard header="Utworzone pytanie:">
      <div class="question">
        {{ newQuestion }}
      </div>
    </WhiteCard>
    <div>Wybrane katalogi (3/12)</div>
    <div class="library">
      <div class="library_data">
        <div
          v-for="catalog in actualCatalogs"
          :key="catalog.id"
          class="catalog"
        >
          <div class="catalog_name">{{ catalog.title }}</div>
          <div class="catalog_icon">
            <v-icon>mdi-plus</v-icon>
          </div>
        </div>
      </div>
      <div class="library_pagination">
        <div class="btn">
          <v-icon>mdi-arrow-left-bold-circle-outline</v-icon>
        </div>
        <div class="paginationData">1-10 / 97</div>
        <div class="btn">
          <v-icon>mdi-arrow-right-bold-circle-outline</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.library {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &_data {
    background-color: #fffefd;
    border: 1px $mainBrownColor solid;
    border-radius: 12px;
    padding: 4px;
    
    .catalog {
      display: flex;
      gap: 4px;
      color: $grayColor;
      
      &_name {
        padding: 0 12px;
        display: flex;
        align-items: center;
        flex-grow: 1;
      }
      
      &_icon {
        border-radius: 4px;
        color: white;
        margin: 4px;
        background-color: $mainBrownColor;
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
      background-color: $mainBrownColor;
      color: white;
      font-size: 20px;
      padding: 4px;
      border-radius: 10px;
    }
  }

  .paginationData {
    color: $mainBrownColor;
    font-weight: 600;
  }
}

.questionCreator {
  width: 350px;
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
