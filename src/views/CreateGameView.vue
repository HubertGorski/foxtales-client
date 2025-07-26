<script setup lang="ts">
import { ref } from "vue";
import HubSwitch from "@/components/hubComponents/HubSwitch.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import router from "@/router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { Game } from "@/models/Game";

const signalRStore = useSignalRStore();

const newGame = ref(signalRStore.game || new Game());
if (!newGame.value.code) {
  router.push(ROUTE_PATH.MENU);
}

const removeRoom = async () => {
  await signalRStore.removeRoom();
  router.push(ROUTE_PATH.MENU);
};
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <div class="creamCard">
        <p class="title">{{ $t("lobby.createGame") }}</p>
        <div class="settings">
          <HubSwitch
            v-model="newGame.usePrivateQuestions"
            label="lobby.usePrivateQuestions"
            tooltipText="tooltip.privateQuestionsDescription"
            withIcon
          />
          <HubSwitch
            v-model="newGame.usePublicQuestions"
            label="lobby.usePublicQuestions"
            tooltipText="tooltip.publicQuestionsDescription"
            withIcon
          />
          <HubSwitch
            v-model="newGame.isPublic"
            label="lobby.gameVisibleOnList"
            tooltipText="tooltip.roomOnListDescription"
            withIcon
          />
          <HubSwitch
            v-model="newGame.isQuestionsFromAnotherGamesAllowed"
            label="lobby.isQuestionsFromAnotherGamesAllowed"
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
        <NavigationBtns btn="back" btn2="next" :btnCustomAction="removeRoom" />
      </div>
    </div>
    <img src="@/assets/imgs/fox5.png" alt="Lisek" class="fox" />
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
    padding: 24px;
  }

  &_card {
    padding: 24px 24px 0 24px;
    width: 100%;

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

  .fox {
    width: 90%;
  }
}
</style>
