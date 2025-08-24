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
      signalRStore.setNewRound();
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

if (game == null || !game.value.code) {
  router.push(ROUTE_PATH.MENU);
}

watch(game, (game: Game | null) => {
  if (game == null || game.code == null) {
    router.push({
      path: ROUTE_PATH.NO_ACCESS,
      query: { reason: NO_ACCESS_REASON.GAME_CLOSED },
    });
  }

  if (game?.readyUsersCount !== game?.usersCount) {
    return;
  }

  signalRStore.markAllUsersUnready();

  if (currentStep.value == 2) {
    handleNextStep();
  }
});
</script>

<template>
  <div class="psychGameView">
    <div class="psychGameView_header">
      <NavigationBtns btn="leaveGame" :btnCustomAction="leaveRoom" />
      <span class="roundInfo">{{ $t("round") }} {{ game.round }}</span>
    </div>
    <transition name="fade" mode="out-in">
      <StepEnd v-if="game.hasGameEnded" />
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
  padding: 12px;

  &_header {
    display: flex;
    gap: 8px;
    align-items: center;

    .navigationBtns_btn.hubBtn {
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
