<script setup lang="ts">
import { computed, toRef } from "vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import NavigationBtns from "../NavigationBtns.vue";
import Podium from "../Podium.vue";
import FoxWithName from "../FoxWithName.vue";
import { useUserStore } from "@/stores/userStore";

const signalRStore = useSignalRStore();
const userStore = useUserStore();

const emit = defineEmits<{
  (e: "leaveRoom"): void;
}>();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const usersSortedByPlace = computed(() =>
  [...game.value.users].sort((a, b) => b.pointsInGame - a.pointsInGame)
);

const place = computed(() => {
  const index = usersSortedByPlace.value.findIndex(
    (user) => user.userId === userStore.user.userId
  );

  return index === -1 ? null : index + 1;
});

const leaveRoom = () => {
  emit("leaveRoom");
};
</script>

<template>
  <div class="stepEnd">
    <div class="results">
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
      <HubDivider :text="$t('summary')" />
      <div class="results_summary">
        <div class="whiteCard whiteCardContent">
          <span> Gracze, których najbardziej bawisz: Antek, Maryla, </span>
          <br />
          ---
          <br />
          <span> Gracze, którzy najbardziej bawią Ciebie: Natka, Adam, </span>
          <br />
          ---
          <br />
          <span> Dowiedziałeś się o sobie 132 rzeczy. </span>

          <br />
          ---
          <br />
          <span> Wybrano Twoje odpowiedzi 10 razy. </span>
        </div>
        <img src="@/assets/imgs/fox11.png" alt="Lisek" />
      </div>
    </div>
    <NavigationBtns
      btn="leaveGame"
      :btnCustomAction="leaveRoom"
      btn2="shop"
      btn2Disabled
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.stepEnd {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;

  .results {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;

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

    &_summary {
      display: flex;
      align-items: end;
      padding-top: 24px;
      max-height: 230px;

      img {
        max-width: 124px;
      }
    }
  }
}
</style>
