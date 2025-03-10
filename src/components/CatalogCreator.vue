import HubBtn from "./hubComponents/HubBtn.vue";
<script setup lang="ts">
import { Catalog } from "@/models/Catalog";
import WhiteSelectList from "./whiteSelectList/WhiteSelectList.vue";
import { useUserStore } from "@/stores/userStore";
import { computed, ref, watch } from "vue";
import { ICON } from "@/enums/iconsEnum";
import {
  convertQuestionToListElement,
  ListElement,
} from "./whiteSelectList/ListElement";
import HubBtn from "./hubComponents/HubBtn.vue";

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "closePopup"): void;
}>();

const catalog = defineModel({ type: Catalog, required: true });

const userStore = useUserStore();

const formBtn = computed(() => {
  return {
    text: props.editMode ? "accept" : "add",
    isOrange: true,
    action: props.editMode ? editCatalog : addCatalog,
    disabled: catalog.value.title.length < 3 || !catalog.value.size,
  };
});

const addCatalog = () => {
  addSelectedQuestionsToCatalog();
  catalog.value.id = Math.floor(Math.random() * 999);
  userStore.addCatalog(catalog.value);
  console.log("Dodano katalog: ", catalog.value.title);
  actualQuestions.value = getActualQuestions();
  catalog.value = new Catalog();
  closePopup();
};

const editCatalog = () => {
  addSelectedQuestionsToCatalog();
  userStore.editCatalog(catalog.value);
  console.log("Edytowano katalog: ", catalog.value.title);
  actualQuestions.value = getActualQuestions();
  catalog.value = new Catalog();
  closePopup();
};

const closePopup = () => {
  emit("closePopup");
};

const getActualQuestions = () => {
  const items = userStore.user.questions.map(convertQuestionToListElement);
  items.forEach((item) => {
    if (
      catalog.value.questions.map((question) => question.id).includes(item.id)
    ) {
      item.setSelected();
    }
  });

  return items;
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

const actualQuestions = ref<ListElement[]>(getActualQuestions());

watch(catalog, () => { 
  actualQuestions.value = getActualQuestions();
});

</script>

<template>
  <div class="catalogCreator creamCard">
    <div class="catalogCreator_title">
      <div v-if="editMode">{{ $t('editCatalog') }}</div>
      <div v-else>{{ $t('createCatalog') }}</div>
      <v-icon @click="closePopup">{{ ICON.X }}</v-icon>
    </div>
    <v-text-field v-model="catalog.title" :label="$t('title')" hide-details />
    <v-textarea
      v-model="catalog.description"
      :label="$t('description')"
      :rows="3"
      hide-details
    />
    <div class="catalogCreator_subtitle">{{ $t('chooseCatalogSize') }}</div>
    <div class="selectSize">
      <div
        class="selectSize_size"
        :class="{ isSelected: catalog.size === type.size }"
        @click="catalog.size = type.size"
        v-for="type in catalog.availableTypes"
        :key="type.id"
      >
        <p class="catalogName">{{ $t(type.name) }}</p>
        <p class="catalogSize">{{ `${$t("size")}: ${type.size}` }}</p>
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
      :action="formBtn.action"
      :text="formBtn.text"
      :disabled="formBtn.disabled"
      :isOrange="formBtn.isOrange"
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
