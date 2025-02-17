<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { ROUTE_PATH } from "@/router/routeEnums";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { Game } from "@/models/Game";
import { games } from "@/assets/data/games";
import HubDivider from "@/components/hubComponents/HubDivider.vue";
import HubInputBox from "@/components/hubComponents/HubInputBox.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import WhiteCard from "@/components/WhiteCard.vue";

const router = useRouter();
const { t } = useI18n();

const actualGames: Game[] = games.filter((game) => game.isPublic);

const customCode = ref<string>("");
const password = ref<string>("");
const isPasswordPopupOpen = ref<boolean>(false);

const acceptCodeBtn = computed(() => {
  return {
    text: t("join"),
    isOrange: true,
    disabled: customCode.value.length === 0,
    action: () => router.push(ROUTE_PATH.LOBBY),
  };
});

const acceptPasswordBtn = computed(() => {
  return {
    text: t("join"),
    isOrange: true,
    disabled: password.value.length === 0,
    action: () => router.push(ROUTE_PATH.LOBBY),
  };
});

const backBtn = {
  id: 1,
  text: t("back2"),
  isOrange: false,
  action: () => router.push(ROUTE_PATH.MENU),
};

const goToLobby = () => {
  router.push(ROUTE_PATH.LOBBY);
};

const openPasswordPopup = () => {
  password.value = "";
  isPasswordPopupOpen.value = true;
};
</script>

<template>
  <div class="joinGameView">
    <HubPopup v-model="isPasswordPopupOpen">
      <HubInputBox
        v-model="password"
        class="joinGameView_gameDetailsPopup"
        title="accessPasswordRequired"
        :btnAction="acceptPasswordBtn.action"
        :btnText="acceptPasswordBtn.text"
        :btnIsOrange="acceptPasswordBtn.isOrange"
        textPlaceholder="password"
        textType="password"
      />
    </HubPopup>
    <HubInputBox
      v-model="customCode"
      title="joinWithCode"
      withFoxImg
      :btnAction="acceptCodeBtn.action"
      :btnText="acceptCodeBtn.text"
      :btnIsOrange="acceptCodeBtn.isOrange"
    />
    <HubDivider />
    <div class="joinGameView_chooseRoom creamCard">
      <p class="subtitle">Wybierz pokój z listy</p>
      <div v-if="actualGames.length === 0" class="emptyGamesList">
        <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
        <p>Brak publicznych pokoi</p>
      </div>
      <div v-else class="gamesList">
        <WhiteCard
          :header="game.name"
          @click="game.isPasswordSet ? openPasswordPopup() : goToLobby()"
          v-for="game in actualGames"
          :key="game.code"
        >
          <div class="details">
            <div v-if="game.password">
              <v-icon>mdi-lock</v-icon>
              <span>Wymagane hasło</span>
            </div>
            <div>
              <v-icon>mdi-account-multiple</v-icon>
              <span>{{ game.usersCount }} graczy w pokoju</span>
            </div>
          </div>
        </WhiteCard>
      </div>
    </div>
    <div class="joinGameView_controls">
      <HubBtn
        class="btn"
        :action="backBtn.action"
        :text="backBtn.text"
        :isOrange="backBtn.isOrange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.joinGameView {
  background: $mainBackground;
  padding: 46px 24px 24px 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  position: relative;

  &_gameDetailsPopup {
    width: 310px;
  }

  &_controls {
    display: flex;
    width: 100%;
    gap: 12px;

    .btn {
      padding: 8px 12px;
      font-size: 16px;
    }
  }

  &_chooseRoom {
    flex-grow: 1;
    padding: 24px;

    .emptyGamesList {
      padding-top: 18px;

      img {
        opacity: 0.2;
        width: 100%;
      }
      p {
        color: $mainBrownColor;
        font-weight: 600;
        text-align: center;
        width: 100%;
      }
    }

    .gamesList {
      overflow-y: scroll;
      height: 284px;

      .details {
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        letter-spacing: 0.5px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .v-icon {
          margin: 0 4px;
        }
      }
    }
  }

  .subtitle {
    color: $grayColor;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 12px;
  }
}
</style>
