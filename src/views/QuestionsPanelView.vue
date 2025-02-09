<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import HubDivider from '@/components/hubComponents/HubDivider.vue';
import HubInputBox from '@/components/hubComponents/HubInputBox.vue';
import { ref } from 'vue';

const router = useRouter();
const { t } = useI18n();

const addQuestion = () => {
  event.preventDefault();
  if (!newQuestion.value) {
    return;
  }

  console.log(`Dodano pytanie: "${newQuestion.value}"`)
  newQuestion.value = '';
}

const addQuestionBtn = {
  text: t("add"),
  isOrange: false,
  action: addQuestion
}

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.SETTINGS)
  },
  {
    id: 2,
    text: "Kup premium",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true
  },
]

const newQuestion = ref<string>('');

</script>

<template>
  <div class="questionsPanelView">
    <div class="questionsPanel">
      <HubInputBox
      v-model="newQuestion"
      title="addQuestionToLibrary"
      :btnAction="addQuestionBtn.action"
      :btnText="addQuestionBtn.text"
      :btnIsOrange="addQuestionBtn.isOrange"
      isTextarea/>
      <HubDivider />
      <div class="manageLibrary whiteCard">
        <div class="manageLibrary_subtitle">
          {{ t('manageLibrary') }}
        </div>
      </div>
    </div>
    <div class="controls">
      <HubBtn class="controls_btn" :action="btns[0].action" :text="btns[0].text" :isOrange="btns[0].isOrange"/>
      <HubBtn class="controls_btn" :action="btns[1].action" :text="btns[1].text" :isOrange="btns[1].isOrange" :disabled="btns[1].disabled"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

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
    
    .manageLibrary {
      flex-grow: 1;

      &_subtitle {
        color: $grayColor;
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 12px;
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
