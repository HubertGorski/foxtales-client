<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { computed, ref } from "vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import QuestionCreator from "@/components/QuestionCreator.vue";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import { Catalog } from "@/models/Catalog";
import { ICON } from "@/enums/iconsEnum";
import CatalogCreator from "@/components/CatalogCreator.vue";

const router = useRouter();

const isCatalogCreatorOpen = ref<boolean>(false);
const isAddQuestionPanelVisible = ref<boolean>(true);
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

const addQuestionBtn = {
  text: "add",
  isOrange: true,
  action: addQuestion,
};

const addCatalogBtn = computed(() => {
  return {
    text: "add",
    isOrange: true,
    action: addQuestion,
    disabled:
      newCatalog.value.title.length < 4,
  };
});

const btns = [
  {
    id: 1,
    text: "back",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    id: 2,
    text: "shop",
    isOrange: true,
    disabled: true,
    action: () => router.push(ROUTE_PATH.MENU),
  },
];

const newQuestion = ref<string>("");
const newCatalog = ref<Catalog>(new Catalog());
</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isQuestionCreatorOpen">
      <QuestionCreator :newQuestion="newQuestion" @addQuestion="addQuestion" />
    </HubPopup>
    <HubPopup v-model="isCatalogCreatorOpen">
      <CatalogCreator v-model="newCatalog" :btn="addCatalogBtn" />
    </HubPopup>
    <HubAccordionElement
      @click="isCatalogCreatorOpen = true"
      title="addCatalogToLibrary"
      isSmallerTitle
    />
    <HubAccordionElement
      title="addQuestionToLibrary"
      :isOpen="isAddQuestionPanelVisible"
      isSmallerTitle
      withStatusIcon
      @toggleAccordion="isAddQuestionPanelVisible = !isAddQuestionPanelVisible"
    >
      <HubInputWithBtn
        v-model="newQuestion"
        class="addQuestionToLibrary"
        title="addQuestionToLibrary"
        :btnAction="addQuestionBtn.action"
        :btnText="addQuestionBtn.text"
        :extraBtnIcon="ICON.ADD_TO_COLLECTION"
        :extraBtnAction="showCatalogsList"
        :btnIsOrange="addQuestionBtn.isOrange"
        isTextarea
      />
    </HubAccordionElement>
    <HubAccordionElement
      class="manageLibrary"
      title="manageLibrary"
      isOpen
      isSmallerTitle
    >
      <div>Pytania i catalogi tu beda</div>
    </HubAccordionElement>
    <div class="controls">
      <HubBtn
        class="controls_btn"
        :action="btns[0].action"
        :text="btns[0].text"
        :isOrange="btns[0].isOrange"
      />
      <HubBtn
        class="controls_btn"
        :action="btns[1].action"
        :text="btns[1].text"
        :isOrange="btns[1].isOrange"
        :disabled="btns[1].disabled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.libraryView {
  background: $mainBackground;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .addQuestionToLibrary {
    padding: 12px;
  }

  .manageLibrary {
    flex-grow: 1;
  }

  .controls {
    display: flex;
    gap: 12px;

    &_btn {
      padding: 12px 24px;
    }
  }
}
</style>
