<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";
import UserListElement from "../UserListElement.vue";
import LevelBar from "../LevelBar.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/userStore";

const { t } = useI18n();
const signalRStore = useSignalRStore();
const userStore = useUserStore();

const emit = defineEmits<{
  (e: "nextStep"): void;
}>();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const timer = ref<number>(90);
const selectedAnswerUserId = ref<number | null>(null);
const isUserReady = ref<boolean>(false);
const currentStep = ref<number>(0);

const confirmSelectedAnswer = () => {
  if (!selectedAnswerUserId.value) {
    return;
  }

  signalRStore.chooseAnswer(userStore.user.userId, selectedAnswerUserId.value);
  isUserReady.value = true;
};

const selectAnswer = (userId: number | null) => {
  if (isUserReady.value || !userId) {
    return;
  }

  selectedAnswerUserId.value = userId;
};

const chooseAnswerText = computed(() => {
  if (currentStep.value === 0) {
    return isUserReady.value ? t("waitForVotes") : t("chooseAnswer");
  }

  return t("voteResults");
});

const confirmBtn = computed(() => {
  return {
    text: isUserReady.value ? "accepted" : "accept",
    isOrange: true,
    action: confirmSelectedAnswer,
    disabled: !selectedAnswerUserId.value || isUserReady.value,
  };
});

const nextPageBtn = computed(() => {
  return {
    text: "next",
    isOrange: true,
    action: () => {
      emit("nextStep");
    },
    disabled: false,
  };
});

watch(game, (game: Game | null) => {
  if (game?.readyUsersCount == game?.usersCount) {
    currentStep.value = 1;
  }
});
</script>

<template>
  <div class="stepVoting">
    <HubDivider :text="chooseAnswerText" />
    <div class="answers">
      <UserListElement
        v-for="user in game.users"
        :key="user.userId"
        :text="user.answer?.answer ?? ''"
        :avatarLabel="currentStep ? user.username : ''"
        :label="
          currentStep ? `${$t('votersCount')} ${user.answer?.votersCount}` : ''
        "
        :isSelected="selectedAnswerUserId === user.userId"
        :imgSource="
          currentStep
            ? user.avatar.source
            : 'src/assets/imgs/defaultAvatars/idk.png'
        "
        isSelectedBold
        @click="selectAnswer(user.userId)"
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
