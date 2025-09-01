<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { userService } from "@/api/services/UserService";
import { User } from "@/models/User";
import { useSignalRStore } from "@/stores/signalRStore";
import { Game } from "@/models/Game";

const userStore = useUserStore();
const router = useRouter();
const signalRStore = useSignalRStore();

const navigateToJoinGame = async () => {
  await signalRStore.connect();
  await signalRStore.goToJoinGameView();
  router.push(ROUTE_PATH.JOIN_GAME);
};

const navigateToCreateGame = async () => {
  await signalRStore.connect();
  await signalRStore.createRoom(new Game(userStore.user));
  router.push(ROUTE_PATH.CREATE_GAME);
};

const goToLibrary = () => {
  router.push(ROUTE_PATH.LIBRARY);
};

const logout = async () => {
  await userService.logout();
  router.push(ROUTE_PATH.HOME);
  userStore.setUserSession(new User());
};
</script>

<template>
  <div class="menuView">
    <div class="menu">
      <div class="welcomeMessage">
        <span class="welcomeMessage_greeting">{{ $t("hi") }}</span>
        <span class="welcomeMessage_name">{{ userStore.user.username }}!</span>
        <p class="welcomeMessage_text">{{ $t("haveFunAndEnjoyGame") }}</p>
      </div>
      <HubAccordionElement
        @click="navigateToCreateGame"
        title="createNewGame"
      />
      <HubAccordionElement @click="navigateToJoinGame" title="joinTheGame" />
      <div @click="goToLibrary" class="menu_elementWithFox">
        <img class="fox" src="@/assets/imgs/7.png" alt="Lisek" />
        <HubAccordionElement title="manageLibrary" isTitleCenter />
      </div>
    </div>
    <img :src="userStore.getFox()" alt="Lisek" class="mainFox" />
    <NavigationBtns
      class="navigationBtns"
      btn="settings"
      btn2="logout"
      :btn2CustomAction="logout"
      isColumnDirection
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.menuView {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $mainBackground;
  padding: 16px 16px 0 16px;
  overflow: hidden;
  position: relative;

  .menu {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .welcomeMessage {
      font-weight: 600;
      margin-bottom: 36px;

      &_greeting {
        font-size: 56px;
        line-height: 64px;
        color: $grayColor;
      }

      &_name {
        display: block;
        width: 100%;
        font-size: 3em;
        max-height: 2.8em;
        line-height: 64px;
        color: $mainOrangeColor;
        overflow-x: scroll;
        overflow-y: scroll;
      }

      &_text {
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        margin-top: 10px;
        letter-spacing: 0.5px;
      }
    }

    &_elementWithFox {
      position: relative;

      .fox {
        position: absolute;
        width: 78px;
        bottom: 0;
        left: 0;
        border-radius: 12px;
      }
    }
  }

  .mainFox {
    position: absolute;
    max-width: 210px;
    bottom: 0;
    margin-left: -16px;
    z-index: 2;
  }

  .navigationBtns {
    width: 50%;
    position: absolute;
    bottom: 8px;
    right: 12px;
  }
}
</style>
