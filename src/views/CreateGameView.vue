<script setup lang="ts">
import { ref } from "vue";
import HubSwitch from "@/components/hubComponents/HubSwitch.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import router from "@/router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { Game } from "@/models/Game";
import SelectQuestionsPanel, {
  type SelectedQuestions,
} from "@/components/SelectQuestionsPanel.vue";
import type { Question } from "@/models/Question";
import { useUserStore } from "@/stores/userStore";

const signalRStore = useSignalRStore();
const userStore = useUserStore();

const currentQuestions = ref<Question[]>([]);
const newGame = ref(signalRStore.game || new Game());
if (!newGame.value.code) {
  router.push(ROUTE_PATH.MENU);
}

const removeRoom = async () => {
  await signalRStore.removeRoom();
  router.push(ROUTE_PATH.MENU);
};

const editRoom = async () => {
  await signalRStore.editRoom(newGame.value);
  await signalRStore.addQuestionsToGame(
    userStore.user.userId,
    currentQuestions.value
  );
  router.push(ROUTE_PATH.LOBBY);
};

const setCurrentQuestions = async (questions: SelectedQuestions) => {
  currentQuestions.value = questions.questions;
  userStore.user.chosenQuestionsSource = questions.source;
  userStore.user.chosenCatalogId = questions.chosenCatalogId;
};
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <img src="@/assets/imgs/fox7.png" alt="Lisek" class="fox" />
      <div class="creamCard">
        <p class="title">{{ $t("lobby.createGame") }}</p>
        <div class="settings">
          <HubSwitch
            v-model="newGame.usePublicQuestions"
            label="lobby.usePublicQuestions"
            tooltipText="tooltip.publicQuestionsDescription"
            withIcon
          />
          <SelectQuestionsPanel
            v-model:usePrivateQuestions="newGame.usePrivateQuestions"
            @setQuestions="setCurrentQuestions"
          />
          <HubSwitch
            v-model="newGame.isQuestionsFromAnotherGamesAllowed"
            label="lobby.isQuestionsFromAnotherGamesAllowed"
          />
          <HubSwitch
            v-model="newGame.isPublic"
            label="lobby.gameVisibleOnList"
            tooltipText="tooltip.roomOnListDescription"
            withIcon
          />
        </div>
        <div v-if="!newGame.isPublic" class="customCodeSection">
          <p class="customCodeSection_description">
            {{ $t("lobby.inviteOtherPlayers") }}
          </p>
          <p class="customCodeSection_code">{{ newGame.code }}</p>
        </div>
        <div class="publicSection" v-else>
          <v-text-field
            class="publicSection_input"
            v-model="newGame.password"
            :label="$t('lobby.entryPassword')"
            type="password"
            outlined
            dense
            hide-details
          />
          <span class="publicSection_info">{{ $t("info.passwordRoom") }}</span>
        </div>
        <NavigationBtns
          btn="closeGame"
          btn2="accept"
          :btnCustomAction="removeRoom"
          :btn2CustomAction="editRoom"
          btn2isOrange
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";

.createGameView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .creamCard {
    padding: 14px;
  }

  &_card {
    padding: 24px 24px 0 24px;
    width: 100%;
    position: relative;
    margin: 46px;

    .fox {
      position: absolute;
      height: 132px;
      right: 32px;
      top: -46px;
    }

    .title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
    }
    .settings {
      padding-bottom: 12px;

      .hubSwitch_content {
        max-width: 210px;
      }
    }

    .customCodeSection {
      height: 128px;
      padding-bottom: 24px;

      &_description {
        color: $grayColor;
      }

      &_code {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        font-weight: bold;
        color: $mainBrownColor;
        letter-spacing: 2px;
      }
    }

    .publicSection {
      margin-bottom: 12px;

      &_input {
        margin-bottom: 12px;
      }

      &_info {
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        margin: 12px 0;
      }
    }
  }
}
</style>
