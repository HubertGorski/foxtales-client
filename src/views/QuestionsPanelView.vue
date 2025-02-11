<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import HubDivider from "@/components/hubComponents/HubDivider.vue";
import HubInputBox from "@/components/hubComponents/HubInputBox.vue";
import { ref } from "vue";

const router = useRouter();
const { t } = useI18n();

const isAddQuestionPanelVisible = ref<boolean>(false);

const addQuestion = () => {
  event.preventDefault();
  if (!newQuestion.value) {
    return;
  }

  console.log(`Dodano pytanie: "${newQuestion.value}"`);
  newQuestion.value = "";
};

const addQuestionBtn = {
  text: t("add"),
  isOrange: false,
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
    text: "Kup premium",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true,
  },
];

const newQuestion = ref<string>("");
</script>

<template>
  <div class="questionsPanelView">
    <div class="questionsPanel">
      <HubInputBox
        @click="isAddQuestionPanelVisible = true"
        v-model="newQuestion"
        class="questionsPanel_addQuestionPanel"
        :class="{ isHidden: !isAddQuestionPanelVisible }"
        title="addQuestionToLibrary"
        :btnAction="addQuestionBtn.action"
        :btnText="addQuestionBtn.text"
        :btnIsOrange="addQuestionBtn.isOrange"
        isTextarea
      />
      <HubDivider />
      <div
        class="manageLibrary whiteCard"
        @click="isAddQuestionPanelVisible = false"
      >
        <div class="manageLibrary_subtitle">
          {{ t("manageLibrary") }}
        </div>
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
      </div>
    </div>
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

  .questionsPanel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;

    &_addQuestionPanel {
      height: 310px;
      overflow: hidden;
      transition: all 0.4s;

      &.isHidden {
        height: 74px;
        transition: all 0.4s;
      }
    }

    .manageLibrary {
      flex-grow: 1;
      padding: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &_subtitle {
        color: $grayColor;
        padding: 20px;
        font-size: 18px;
        font-weight: 600;
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
