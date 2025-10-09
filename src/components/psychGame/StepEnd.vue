<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import Podium from "../Podium.vue";
import FoxWithName from "../FoxWithName.vue";
import { useUserStore } from "@/stores/userStore";
import { cloneDeep } from "lodash";
import SummaryGame from "./SummaryGame.vue";
import HubBtn from "../hubComponents/HubBtn.vue";

const signalRStore = useSignalRStore();
const userStore = useUserStore();
const isSummaryVisible = ref<boolean>(false);

const emit = defineEmits<{
  (e: "leaveRoom"): void;
}>();

const game = cloneDeep(signalRStore.game) ?? new Game();

const usersSortedByPlace = computed(() =>
  [...game.users].sort((a, b) => b.pointsInGame - a.pointsInGame)
);

const place = computed(() => {
  const index = usersSortedByPlace.value.findIndex(
    (user) => user.userId === userStore.user.userId
  );

  return index === -1 ? null : index + 1;
});

const navigationBtns = computed(() => {
  const leaveRoomBtn = {
    id: 1,
    text: "leaveGame",
    isOrange: false,
    isDisabled: false,
    action: () => emit("leaveRoom"),
  };

  const backBtn = {
    id: 2,
    text: "back",
    isOrange: false,
    isDisabled: false,
    action: () => (isSummaryVisible.value = false),
  };

  const goToSummaryBtn = {
    id: 3,
    text: "summary",
    isOrange: true,
    isDisabled: false,
    action: () => (isSummaryVisible.value = true),
  };

  const goToShopBtn = {
    id: 4,
    text: "shop",
    isDisabled: true,
    isOrange: true,
    action: () => {
      return;
    },
  };

  return isSummaryVisible.value
    ? [backBtn, goToShopBtn]
    : [leaveRoomBtn, goToSummaryBtn];
});
</script>

<template>
  <div class="stepEnd">
    <transition name="fade" mode="out-in">
      <div v-if="!isSummaryVisible" class="results">
        <HubDivider :text="$t('endOfTheGame')" />
        <div class="results_info">
          <div>
            <FoxWithName :text="$t('you')" :src="userStore.getFox()" />
            <div class="rank">{{ place }} {{ $t("place") }}</div>
          </div>
          <div class="whiteCard whiteCardContent">
            <span>Lista wyników:</span>
            <br />
            <span
              :class="{ isBold: user.userId === userStore.user.userId }"
              v-for="(user, index) in usersSortedByPlace"
              :key="user.userId"
              >{{ index + 1 }}. {{ user.username }} - {{ user.pointsInGame }}
              {{ $t("exp") }}</span
            >
          </div>
        </div>
        <HubDivider :text="$t('top3users')" />
        <Podium :users="usersSortedByPlace" />
      </div>
      <SummaryGame :users="game.users" v-else />
    </transition>
    <div class="btns">
      <HubBtn
        v-for="btn in navigationBtns"
        :key="btn.id"
        :text="btn.text"
        :disabled="btn.isDisabled"
        :action="btn.action"
        :isOrange="btn.isOrange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
@import "@/assets/styles/hubAnimations";

.stepEnd {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  overflow: auto;

  .btns {
    display: flex;
    gap: 12px;
    padding: 12px;

    .hubBtn {
      padding: 8px;
    }
  }

  .results {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding-top: 8px;

    &_info {
      padding: 12px 0;
      display: flex;
      gap: 12px;
      justify-content: center;

      .rank {
        position: relative;
        text-align: center;
        color: $mainBrownColor;
        font-weight: 600;
        font-size: 18px;
        border-radius: 8px;
        border: 1px solid $mainBrownColor;
        background-color: $whiteColor;
      }

      .rank::after {
        content: "";
        position: absolute;
        height: 8px;
        width: 106px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        top: -8px;
        left: 8px;
        background-color: $mainBrownColor;
      }
    }
  }
}
</style>
