<script setup lang="ts">
import { Answer } from "@/models/Answer";
import { computed, ref } from "vue";
import UserListElement from "../UserListElement.vue";
import LevelBar from "../LevelBar.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";

const props = defineProps({
  game: {
    type: Game,
    required: true,
  },
});

const users = props.game.users;
const timer = ref<number>(90);
const selectedAnswer = ref<Answer | null>(null);
const isUserReady = ref<boolean>(true);
const currentStep = ref<number>(1);

const confirmSelectedAnswer = () => {
  if (!selectedAnswer.value?.id) {
    return;
  }

  isUserReady.value = true;
};

const selectAnswer = (answer: Answer | null) => {
  if (isUserReady.value || !answer) {
    return;
  }
  
  selectedAnswer.value = answer;
};

const confirmBtn = computed(() => {
  return {
    text: isUserReady.value ? "accepted" : "accept",
    isOrange: true,
    action: confirmSelectedAnswer,
    disabled: !selectedAnswer.value?.id || isUserReady.value,
  };
});

const nextPageBtn = computed(() => {
  return {
    text: "next",
    isOrange: true,
    action: confirmSelectedAnswer,
    disabled: false,
  };
});
</script>

<template>
  <div class="stepVoting">
    <HubDivider :text="$t('chooseAnswer')" />
    <div class="answers">
      <UserListElement
        v-for="user in users"
        :key="user.answer?.id"
        :text="user.answer?.answer ?? 'brak odp'"
        :label="currentStep ? `Ilość głosów: ${user.answer?.votersCount}` : ''"
        :isSelected="selectedAnswer?.id === user.answer?.id"
        :imgSource="currentStep ? user.avatar.source : 'src/assets/imgs/defaultAvatars/idk.png'"
        isSelectedBold
        @click="selectAnswer(user.answer)"
      />
    </div>
    <div v-if="!currentStep" class="acceptPanel">
      <LevelBar
        v-if="!isUserReady"
        :points="timer - 9"
        :requiredPointsToNextLevel="timer"
        :showPointInfo="false"
      />
      <HubBtn
        :action="confirmBtn.action"
        :text="confirmBtn.text"
        :isOrange="confirmBtn.isOrange"
        :disabled="confirmBtn.disabled"
      />
    </div>
    <div v-else class="nextPageBtn">
      <HubBtn
        :action="nextPageBtn.action"
        :text="nextPageBtn.text"
        :isOrange="nextPageBtn.isOrange"
        :disabled="nextPageBtn.disabled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.stepVoting {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;

  .answers {
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding: 8px;
    width: 100%;
  }

  .acceptPanel {
    padding: 8px 16px;
    width: 100%;

    .hubBtn {
      padding: 8px;
      margin: 4px auto 0;
    }
  }
  .nextPageBtn {
    width: 100%;
    padding-top: 8px;

    .hubBtn {
      padding: 8px;
      margin: 0 auto;
    }
  }
}
</style>
