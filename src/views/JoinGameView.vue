<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, toRef, watch } from "vue";
import { ROUTE_PATH } from "@/router/routeEnums";
import { Game } from "@/models/Game";
import HubDivider from "@/components/hubComponents/HubDivider.vue";
import HubInputBox from "@/components/hubComponents/HubInputBox.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import WhiteCard from "@/components/WhiteCard.vue";
import { ICON } from "@/enums/iconsEnum";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import { useUserStore } from "@/stores/userStore";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const signalRStore = useSignalRStore();
const router = useRouter();
const { t } = useI18n();

const actualGames: Game[] = [];
// const actualGames: Game[] = games.filter((game) => game.isPublic);
const error = toRef(signalRStore, "error");

const customCode = ref<string>("");
const password = ref<string>("");
const isPasswordPopupOpen = ref<boolean>(false);

const errorMessage = computed(() => {
  return error.value ? t(`auth.${error.value}`) : undefined;
});

const acceptCodeBtn = computed(() => {
  return {
    text: "join",
    isOrange: true,
    disabled: customCode.value.length === 0,
    action: () => goToLobby(),
  };
});

const acceptPasswordBtn = computed(() => {
  return {
    text: "join",
    isOrange: true,
    disabled: password.value.length === 0,
    action: () => goToLobby(),
  };
});

const goToLobby = async () => {
  await joinRoom();
  if (errorMessage.value) {
    return;
  }

  router.push(ROUTE_PATH.LOBBY);
};

const openPasswordPopup = () => {
  password.value = "";
  isPasswordPopupOpen.value = true;
};

const joinRoom = async () => {
  if (errorMessage.value) {
    return;
  }

  await signalRStore.connect();
  await signalRStore.joinRoom(customCode.value, userStore.user);
};

watch(customCode, (newVal) => {
  customCode.value = newVal.toUpperCase();
  if (newVal) {
    error.value = null;
  }
});
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
      :error-messages="errorMessage"
    />
    <HubDivider />
    <div class="joinGameView_chooseRoom creamCard">
      <p class="subtitle">{{ $t("joinGame.chooseRoomFromList") }}</p>
      <div v-if="actualGames.length === 0" class="emptyGamesList">
        <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
        <p>{{ $t("joinGame.noPublicRooms") }}</p>
      </div>
      <div v-else class="gamesList">
        <WhiteCard
          :header="game.name"
          @click="game.isPasswordSet ? openPasswordPopup() : goToLobby()"
          v-for="(game, index) in actualGames"
          :key="index"
        >
          <div class="details">
            <div>
              <v-icon>{{ game.foxGame.icon }}</v-icon>
              <span>{{ $t(game.foxGame.name) }}</span>
            </div>
            <div v-if="game.password">
              <v-icon>{{ ICON.LOCK }}</v-icon>
              <span>{{ $t("passwordRequired") }}</span>
            </div>
            <div>
              <v-icon>{{ ICON.USERS }}</v-icon>
              <span>{{
                $t("joinGame.playersInRoom", { count: game.usersCount })
              }}</span>
            </div>
          </div>
        </WhiteCard>
      </div>
    </div>
    <NavigationBtns btn="back2" />
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
