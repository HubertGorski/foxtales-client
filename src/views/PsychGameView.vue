<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import { useRouter } from "vue-router";
import StepQuestion from "@/components/psychGame/StepQuestion.vue";
import StepResults from "@/components/psychGame/StepResults.vue";
import StepVoting from "@/components/psychGame/StepVoting.vue";
import { computed, ref, toRef, watch } from "vue";
import { Game } from "@/models/Game";
import { ROUTE_PATH } from "@/router/routeEnums";
import { NO_ACCESS_REASON } from "@/enums/noAccessReasonEnum";
import { useUserStore } from "@/stores/userStore";
import StepEnd from "@/components/psychGame/StepEnd.vue";
import HubBtn from "@/components/hubComponents/HubBtn.vue";

const router = useRouter();
const signalRStore = useSignalRStore();
const userStore = useUserStore();

const currentStep = ref<number>(0);
const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const getCurrentStep = computed(() => {
  switch (currentStep.value) {
    case 0:
      return StepQuestion;
    case 1:
      return StepVoting;
    case 2:
      return StepResults;
    default:
      currentStep.value = 0;
      signalRStore.setNewRound(userStore.user.userId);
      return StepQuestion;
  }
});

const handleNextStep = () => {
  currentStep.value++;
};

const leaveRoom = async () => {
  await signalRStore.leaveRoom(userStore.user.userId);
  router.push(ROUTE_PATH.MENU);
};

// TODO: zrobic konczenie gry
const finishGame = async () => {
  game.value.hasGameEnded = true;
};

if (game == null || !game.value.code) {
  router.push(ROUTE_PATH.MENU);
}

const finishGameBtn = computed(() => {
  return {
    text:
      userStore.user.userId === game.value.owner.userId
        ? "finishGame"
        : "leaveGame",
    action:
      userStore.user.userId === game.value.owner.userId
        ? finishGame
        : leaveRoom,
  };
});

watch(
  game,
  (game: Game | null) => {
    if (game == null || game.code == null) {
      router.push({
        path: ROUTE_PATH.NO_ACCESS,
        query: { reason: NO_ACCESS_REASON.GAME_CLOSED },
      });

      return;
    }

    userStore.user.isReady = game.users.find(
      (user) => user.userId === userStore.user.userId
    )!.isReady;

    if (game?.readyUsersCount !== game?.usersCount) {
      return;
    }

    if (game?.owner.userId === userStore.user.userId && currentStep.value != 2) {
      signalRStore.markAllUsersUnready();
    }

    if (currentStep.value == 2) {
      handleNextStep();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="psychGameView">
    <div v-if="!game.hasGameEnded" class="psychGameView_header">
      <HubBtn :action="finishGameBtn.action" :text="finishGameBtn.text" />
      <span class="roundInfo">{{ $t("round") }} {{ game.round }}</span>
    </div>
    <transition name="fade" mode="out-in">
      <StepEnd v-if="game.hasGameEnded" @leaveRoom="leaveRoom" />
      <component
        v-else
        :is="getCurrentStep"
        :key="currentStep"
        @nextStep="handleNextStep"
      />
    </transition>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";
@import "@/assets/styles/hubAnimations";

.psychGameView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &_header {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 12px;

    .hubBtn {
      font-size: 16px;
      padding: 4px;
    }

    .roundInfo {
      white-space: nowrap;
      font-size: 20px;
      color: $mainBrownColor;
      padding: 8px;
      font-weight: 600;
    }
  }
}
</style>
