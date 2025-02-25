<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { ref } from "vue";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { Game } from "@/models/Game";
import HubSwitch from "@/components/hubComponents/HubSwitch.vue";

const router = useRouter();

const newGame = ref(new Game("PIESEK1"));

const btns = [
  {
    id: 1,
    text: "back",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    id: 2,
    text: "next",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
];
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <div class="creamCard">
        <p class="title">{{ $t('createGame') }}</p>
        <div class="settings">
          <HubSwitch v-model="newGame.usePrivateQuestions" label="lobby.usePrivateQuestions" tooltipText="tooltip.privateQuestionsDescription" withIcon/>
          <HubSwitch v-model="newGame.usePublicQuestions" label="lobby.usePublicQuestions" tooltipText="tooltip.publicQuestionsDescription" withIcon/>
          <HubSwitch v-model="newGame.isPublic" label="lobby.gameVisibleOnList" tooltipText=tooltip.roomOnListDescription withIcon/>
        </div>
        <div v-if="!newGame.isPublic" class="customCodeSection">
          <p class="customCodeSection_description">
            Zaproś pozostałych podając kod:
          </p>
          <p class="customCodeSection_code">{{ newGame.code }}</p>
        </div>
        <div class="publicSection" v-else>
          <v-text-field
            class="publicSection_input"
            v-model="newGame.password"
            label="Hasło wstępu"
            type="password"
            outlined
            dense
            hide-details
          />
          <span class="publicSection_info">{{ $t("info.passwordRoom") }}</span>
        </div>
        <div class="controls">
          <HubBtn
            class="controls_btn"
            :action="btns[0].action"
            :text="btns[0].text"
            :isOrange="btns[0].isOrange"
          />
          <HubBtn
            class="controls_btn"
            :action="btns[1].action"
            :text="btns[1].text"
            :isOrange="btns[1].isOrange"
          />
        </div>
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

    .controls {
      display: flex;
      gap: 12px;

      &_btn {
        padding: 12px 24px;
      }
    }
  }

  .fox {
    width: 90%;
  }
}
</style>
