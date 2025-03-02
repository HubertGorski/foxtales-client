<script setup lang="ts">
import { computed, ref, watch } from "vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import QuestionCreator from "@/components/QuestionCreator.vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import { Catalog } from "@/models/Catalog";
import { ICON } from "@/enums/iconsEnum";
import CatalogCreator from "@/components/CatalogCreator.vue";
import { useUserStore } from "@/stores/userStore";
import NavigationBtns from "@/components/NavigationBtns.vue";
import WhiteSelectList from "@/components/WhiteSelectList.vue";

const userStore = useUserStore();
const currentUser = userStore.user;

const isCatalogCreatorOpen = ref<boolean>(false);
const isQuestionCreatorOpen = ref<boolean>(false);

const addQuestion = (catalogs: Catalog[]) => {
  event.preventDefault();
  if (!newQuestion.value) {
    return;
  }

  console.log(`Dodano pytanie: "${newQuestion.value}"`);
  if (catalogs && catalogs.length > 0) {
    console.log(
      `Dodano do katalogów: "${catalogs.map((catalog) => catalog.title)}"`
    );
  }
  isQuestionCreatorOpen.value = false;
  newQuestion.value = "";
};

const showCatalogsList = () => {
  isQuestionCreatorOpen.value = true;
};

const addCatalog = () => {
  userStore.addCatalog(newCatalog.value);
  console.log("Dodano katalog: ", newCatalog.value.title);
  isCatalogCreatorOpen.value = false;
  setOpenTab.value = "yourCatalogs";
};

const addQuestionBtn = {
  text: "add",
  isOrange: true,
  action: addQuestion,
};

const addCatalogBtn = computed(() => {
  return {
    text: "add",
    isOrange: true,
    action: addCatalog,
    disabled: newCatalog.value.title.length < 3 || !newCatalog.value.size,
  };
});

const setOpenTab = ref<string>("addQuestion");
const newQuestion = ref<string>("");
const newCatalog = ref<Catalog>(new Catalog());

watch(isCatalogCreatorOpen, () => {
  newCatalog.value = new Catalog();
});
</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isQuestionCreatorOpen">
      <QuestionCreator :newQuestion="newQuestion" @addQuestion="addQuestion" />
    </HubPopup>
    <HubPopup v-model="isCatalogCreatorOpen">
      <CatalogCreator
        v-model="newCatalog"
        :btn="addCatalogBtn"
        @closePopup="isCatalogCreatorOpen = false"
      />
    </HubPopup>
    <HubAccordionElement
      @click="isCatalogCreatorOpen = true"
      title="addCatalog"
      isSmallerTitle
    />
    <HubAccordion
      v-model="setOpenTab"
      :slotNames="['yourCatalogs', 'addQuestion']"
      isSmallerTitle
    >
      <template #yourCatalogs>
        <WhiteSelectList
          class="yourCatalogs"
          v-model="currentUser.catalogs"
          :height="146"
          :itemsPerPage="3"
          :fontSize="14"
          multiple
          showPagination
        />
      </template>
      <template #addQuestion>
        <HubInputWithBtn
          v-model="newQuestion"
          class="addQuestionToLibrary"
          :btnAction="addQuestionBtn.action"
          :btnText="addQuestionBtn.text"
          :extraBtnIcon="ICON.ADD_TO_COLLECTION"
          :extraBtnAction="showCatalogsList"
          :btnIsOrange="addQuestionBtn.isOrange"
          isTextarea
        />
      </template>
    </HubAccordion>
    <HubAccordionElement
      @click="setOpenTab = ''"
      class="manageLibrary"
      title="yourQuestions"
      isOpen
      isSmallerTitle
    >
      <div>Pytania tu beda</div>
    </HubAccordionElement>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.libraryView {
  background: $mainBackground;
  height: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .yourCatalogs {
    padding: 8px;
  }

  .addQuestionToLibrary {
    padding: 12px;
  }

  .manageLibrary {
    flex-grow: 1;
  }
}
</style>
