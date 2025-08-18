<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import StepQuestion from "@/components/psychGame/StepQuestion.vue";
import StepResults from "@/components/psychGame/StepResults.vue";
import StepVoting from "@/components/psychGame/StepVoting.vue";
import { ref } from "vue";
import { Game } from "@/models/Game";
import { ROUTE_PATH } from "@/router/routeEnums";

const router = useRouter();
const game = useSignalRStore().game ?? new Game();
const userStore = useUserStore();

if (game == null || !game.code) {
  router.push(ROUTE_PATH.MENU);
}

const currentStep = ref<number>(0);
</script>

<template>
  <div class="psychGameView">
    <div class="psychGameView_header">
      <NavigationBtns btn="leaveGame" />
      <span class="roundInfo">{{ $t("round") }} {{ game.round }}</span>
    </div>
    <StepQuestion v-if="currentStep === 0" @nextStep="currentStep = 1" />
    <StepVoting v-if="currentStep === 1" />
    <StepResults v-if="currentStep === 2" />
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";
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
