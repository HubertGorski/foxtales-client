<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { Game } from "@/models/Game";

const router = useRouter();
const { t } = useI18n();

const newGame = ref(new Game("PIESEK1"));

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    id: 2,
    text: t("next"),
    isOrange: true,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
];
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <div class="whiteCard">
        <p class="title">Utwórz grę</p>
        <div class="settings">
          <v-switch
            class="settings_switch"
            v-model="newGame.usePrivateQuestions"
            label="Używaj prywatnych pytań"
            inset
            hide-details
            color="orange"
          />
          <v-switch
            class="settings_switch"
            v-model="newGame.usePublicQuestions"
            label="Używaj publicznych pytań"
            inset
            hide-details
            color="orange"
          />
          <v-switch
            class="settings_switch"
            v-model="newGame.isPublic"
            label="Gra widoczna na liście"
            inset
            hide-details
            color="orange"
          />
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
          <span class="publicSection_info"
            >* Bez ustawienia hasła każdy będzie mógł dołączyć do Twojego
            pokoju.</span
          >
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

      &_switch.v-input__control {
        height: 46px;
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
