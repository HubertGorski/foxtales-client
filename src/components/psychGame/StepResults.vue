<script setup lang="ts">
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import { useUserStore } from "@/stores/userStore";
import { computed, toRef } from "vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import UserListElement from "../UserListElement.vue";
import { getAvatar } from "@/utils/imgUtils";

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
    text: "ready",
    isOrange: true,
    action: startNextRound,
    disabled: userStore.user.isReady,
  };
});

const startNextRound = () => {
  userStore.user.isReady = true;
  signalRStore.setStatus(userStore.user.userId, true);
};
</script>

<template>
  <div class="stepResults">
    <HubDivider :text="$t('summary')" />
    <div class="content">
      <div class="summary">
        <UserListElement
          v-for="user in game.users"
          :key="user.userId"
          :imgSource="getAvatar(user.avatar.id)"
          :text="user.username"
          :label="`${user.pointsInGame} ${$t('points')}`"
          :isSelected="user.isReady"
        />
      </div>
      <div class="votersForHisAnswer">
        <img src="@/assets/imgs/fox13.webp" alt="Lisek" />
        <div class="whiteCard voters">
          <div class="title">
            {{
              votersForHisAnswerString
                ? $t("yourAnswerWasChosen")
                : $t("nobodyChoseYourAnswer")
            }}
          </div>
          <div v-if="votersForHisAnswerString" class="yourAnswerWasChosen">
            {{ votersForHisAnswerString }}
          </div>
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
  padding: 12px;
  padding-top: 0;

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .votersForHisAnswer {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      padding: 0 8px;

      .voters {
        margin: 8px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-height: 84px;
        overflow-y: auto;
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

    .hubBtn {
      padding: 8px;
      margin: 0 auto;
    }
  }
}
</style>
