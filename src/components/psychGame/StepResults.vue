<script setup lang="ts">
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import { useUserStore } from "@/stores/userStore";
import { computed, toRef } from "vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import UserListElement from "../UserListElement.vue";
import HubCounterWithTitle from "../hubComponents/HubCounterWithTitle.vue";

const signalRStore = useSignalRStore();
const userStore = useUserStore();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const votersForHisAnswerString = computed<string>(() => {
  const currentUser = game.value.users.find(
    (user) => user.userId === userStore.user.userId
  );
  const votersIds = currentUser?.votersIdsForHisAnswer;

  if (!votersIds?.length) return "";

  const userMap = new Map(game.value.users.map((user) => [user.userId, user]));

  return votersIds
    .map((id) => userMap.get(id)?.username)
    .filter(Boolean)
    .join(", ");
});

const nextPageBtn = computed(() => {
  return {
    text: "next",
    isOrange: true,
    action: startNextRound,
    disabled: false,
  };
});

const startNextRound = () => {};
</script>

<template>
  <div class="stepResults">
    <HubDivider />
    <HubCounterWithTitle
      :value="game.readyUsersCount"
      :maxValue="game.usersCount"
      :title="$t('lobby.waitingForPlayers')"
    />
    <div class="content">
      <div class="summary">
        <UserListElement
          v-for="user in game.users"
          :key="user.userId"
          :imgSource="user.avatar.source"
          :text="user.username"
          :label="`${user.pointsInGame} ${$t('points')}`"
          :isSelected="user.isReady"
        />
      </div>
      <div class="votersForHisAnswer">
        <img src="@/assets/imgs/fox13.png" alt="Lisek" />
        <div class="whiteCard voters">
          <div class="title">{{ votersForHisAnswerString ? $t("yourAnswerWasChosen") : $t("nobodyChoseYourAnswer") }}</div>
          <div v-if="votersForHisAnswerString" class="yourAnswerWasChosen">{{ votersForHisAnswerString }}</div>
        </div>
        <HubDivider />
      </div>
    </div>
    <div class="nextPageBtn">
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

.stepResults {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .votersForHisAnswer {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;

      .voters {
        margin: 8px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-height: 84px;
        overflow-y: scroll;
        padding: 6px;

        .title {
          text-align: center;
          font-size: 14px;
          font-style: italic;
          color: $lightGrayColor;
          letter-spacing: 0.5px;
        }

        .yourAnswerWasChosen {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          color: $grayColor;
          text-align: center;
        }
      }

      .hubDivider {
        grid-column: 1 / -1;
      }

      img {
        max-height: 100px;
      }
    }

    .summary {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
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
