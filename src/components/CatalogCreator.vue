<script setup lang="ts">
import HubBtn from "./hubComponents/HubBtn.vue";
import { Catalog } from "@/models/Catalog";
import WhiteSelectList from "./whiteSelectList/WhiteSelectList.vue";
import { useUserStore } from "@/stores/userStore";
import { computed, ref } from "vue";
import { ICON } from "@/enums/iconsEnum";
import { convertQuestionToListElement, ListElement } from "./whiteSelectList/ListElement";

const emit = defineEmits<{
  (e: "closePopup"): void;
}>();

const catalog = defineModel({ type: Catalog, required: true });

const userStore = useUserStore();

const addCatalogBtn = computed(() => {
  return {
    text: "add",
    isOrange: true,
    action: addCatalog,
    disabled: catalog.value.title.length < 3 || !catalog.value.size,
  };
});

const addCatalog = () => {
  addSelectedQuestionsToCatalog();
  userStore.addCatalog(catalog.value);
  console.log("Dodano katalog: ", catalog.value.title);
  actualQuestions.value = userStore.user.questions.map(convertQuestionToListElement);
  closePopup();
};

const closePopup = () => {
  emit("closePopup");
};

const addSelectedQuestionsToCatalog = () => {
  const selectedQuestions = actualQuestions.value
    .filter((question) => question.isSelected)
    .map((question) => question.id);

  const questions = userStore.user.questions.filter((question) =>
    selectedQuestions.includes(question.id)
  );
  
  catalog.value.setQuestions(questions);
};

const actualQuestions = ref<ListElement[]>(
  userStore.user.questions.map(convertQuestionToListElement)
);
</script>

<template>
  <div class="catalogCreator creamCard">
    <div class="catalogCreator_title">
      <div>Utwórz katalog</div>
      <v-icon @click="closePopup">{{ ICON.X }}</v-icon>
    </div>
    <v-text-field v-model="catalog.title" label="Tytuł" hide-details />
    <v-textarea
      v-model="catalog.description"
      label="Opis"
      :rows="3"
      hide-details
    />
    <div class="catalogCreator_subtitle">Wybierz wielkość katalogu</div>
    <div class="selectSize">
      <div
        class="selectSize_size"
        :class="{ isSelected: catalog.size === type.size }"
        @click="catalog.size = type.size"
        v-for="type in catalog.availableTypes"
        :key="type.id"
      >
        <p class="catalogName">{{ $t(type.name) }}</p>
        <p class="catalogSize">{{ $t("size") }}: {{ type.size }}</p>
      </div>
    </div>
    <WhiteSelectList
      v-model="actualQuestions"
      customSelectedCountTitle="selectedQuestionsToCatalog"
      :fontSize="14"
      showSelectedCount
      multiple
      showPagination
    />
    <HubBtn
      class="catalogCreator_btn"
      :action="addCatalogBtn.action"
      :text="addCatalogBtn.text"
      :disabled="addCatalogBtn.disabled"
      :isOrange="addCatalogBtn.isOrange"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.catalogCreator {
  width: 324px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &_title {
    color: $grayColor;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
  }

  &_subtitle {
    color: $grayColor;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
  .selectSize {
    display: flex;
    justify-content: space-around;
    align-items: center;

    &_size {
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      border-radius: 8px;
      color: $grayColor;
      transition: all 0.2s;
      padding: 12px;
      &.isSelected {
        font-weight: 600;
        transform: scale(1.1);
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 6px;
        transition: all 0.2s;
      }

      .catalogName {
        text-align: center;
      }

      .catalogSize {
        text-align: center;
        font-size: 12px;
      }
    }
  }

  &_btn {
    padding: 8px;
  }
}
</style>
