<script setup lang="ts">
import { ref } from "vue";
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
import WhiteSelectList from "@/components/whiteSelectList/WhiteSelectList.vue";
import {
  convertCatalogsToListElement,
  ListElement,
} from "@/components/whiteSelectList/ListElement";

const userStore = useUserStore();

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

const addNewCatalog = () => {
  editCatalogMode.value = false;
  isCatalogCreatorOpen.value = true;
  currentCatalog.value = new Catalog();
};

const showCatalogsList = () => {
  isQuestionCreatorOpen.value = true;
};

const showCatalogDetails = (catalog: ListElement) => {
  currentCatalog.value = userStore.user.catalogs.find(
    (actualCatalog) => actualCatalog.id === catalog.id
  )!;
  editCatalogMode.value = true;
  isCatalogCreatorOpen.value = true;
};

const closePopup = () => {
  isCatalogCreatorOpen.value = false;
  setOpenTab.value = "yourCatalogs";
  actualCatalogs.value = userStore.user.catalogs.map(
    convertCatalogsToListElement
  );
};

const isCatalogCreatorOpen = ref<boolean>(false);
const isQuestionCreatorOpen = ref<boolean>(false);
const setOpenTab = ref<string>("addQuestion");
const newQuestion = ref<string>("");
const currentCatalog = ref<Catalog>(new Catalog());
const editCatalogMode = ref<boolean>(true);
const actualCatalogs = ref<ListElement[]>(
  userStore.user.catalogs.map(convertCatalogsToListElement)
);
const addQuestionBtn = {
  text: "add",
  isOrange: true,
  action: addQuestion,
};

</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isQuestionCreatorOpen">
      <QuestionCreator :newQuestion="newQuestion" @addQuestion="addQuestion" />
    </HubPopup>
    <HubPopup v-model="isCatalogCreatorOpen">
      <CatalogCreator
        v-model="currentCatalog"
        :editMode="editCatalogMode"
        @closePopup="closePopup"
      />
    </HubPopup>
    <HubAccordionElement
      @click="addNewCatalog"
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
          v-model="actualCatalogs"
          :height="146"
          :itemsPerPage="3"
          :fontSize="14"
          emptyDataText="noDirectoryHasBeenCreatedYet"
          multiple
          showPagination
          showElementsCountInItem
          showItemDetailsBtn
          @showDetails="showCatalogDetails"
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
      centerContent
    >
      <div class="manageLibrary_isComing">
        <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
        <p>
          {{ $t("isComing") }}
        </p>
      </div>
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

    &_isComing {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.9;
      color: $mainBrownColor;
      font-weight: 600;

      img {
        width: 160px;
        height: 140px;
      }
    }
  }
}
</style>
