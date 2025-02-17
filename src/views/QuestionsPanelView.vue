<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { ref } from "vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import QuestionCreator from "@/components/QuestionCreator.vue";

const router = useRouter();
const { t } = useI18n();

const isAddQuestionPanelVisible = ref<boolean>(false);
const isQuestionDetailsOpen = ref<boolean>(false);

const addQuestion = () => {
  event.preventDefault();
  if (!newQuestion.value) {
    return;
  }

  console.log(`Dodano pytanie: "${newQuestion.value}"`);
  newQuestion.value = "";
};

const showCatalogsList = () => {
  isQuestionDetailsOpen.value = true;
};

const addQuestionBtn = {
  text: t("add"),
  isOrange: true,
  action: addQuestion,
};

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.SETTINGS),
  },
  {
    id: 2,
    text: t("shop"),
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true,
  },
];

const newQuestion = ref<string>("");
</script>

<template>
  <div class="questionsPanelView">
    <HubPopup v-model="isQuestionDetailsOpen">
      <QuestionCreator :newQuestion="newQuestion"/>
    </HubPopup>
    <HubAccordion
      :slotNames="['addQuestionToLibrary', 'manageLibrary']"
      setOpenTab="manageLibrary"
      isSmallerTitle
      isDividerVisible
    >
      <template #addQuestionToLibrary
        ><HubInputWithBtn
          @click="isAddQuestionPanelVisible = true"
          v-model="newQuestion"
          class="addQuestionToLibrary"
          title="addQuestionToLibrary"
          :btnAction="addQuestionBtn.action"
          :btnText="addQuestionBtn.text"
          extraBtnIcon="mdi-shape-rectangle-plus"
          :extraBtnAction="showCatalogsList"
          :btnIsOrange="addQuestionBtn.isOrange"
          isTextarea
      /></template>
      <template #manageLibrary>
        <div class="manageLibrary_table">
          <div class="library">
            <div class="library_headers"></div>
            <div class="library_data"></div>
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
      </template></HubAccordion
    >
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

.questionsPanelView {
  background: $mainBackground;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .addQuestionToLibrary {
    padding: 0 24px 24px 24px;
  }

  .library_pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffefd;
    border: 1px $mainBrownColor solid;
    border-radius: 12px;

    .btn {
      background-color: $mainBrownColor;
      color: white;
      font-size: 18px;
      padding: 4px;
      border-radius: 10px;
    }

    .paginationData {
      color: $mainBrownColor;
      font-weight: 600;
    }
  }

  .controls {
    display: flex;
    gap: 12px;
    padding-top: 24px;

    &_btn {
      padding: 12px 24px;
    }
  }
}
</style>
