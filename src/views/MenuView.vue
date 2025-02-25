<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useUserStore } from "@/stores/userStore";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import { computed } from "vue";

const userStore = useUserStore();
const router = useRouter();

const navigateToJoinGame = () => {
  router.push(ROUTE_PATH.JOIN_GAME);
};

const navigateToCreateGame = () => {
  router.push(ROUTE_PATH.CREATE_GAME);
};

const goToLibrary = () => {
  router.push(ROUTE_PATH.LIBRARY);
};

const currentUser = userStore.user;
const btns = [
  {
    id: 1,
    text: "settings",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.SETTINGS),
  },
  {
    id: 2,
    text: "logout",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.HOME),
  },
];

const selectedFox = computed(() => {
  return new URL(`../assets/imgs/${currentUser.avatar.id}.png`, import.meta.url)
    .href;
});
</script>

<template>
  <div class="menuView">
    <div class="menu">
      <div class="welcomeMessage">
        <span class="welcomeMessage_greeting">{{ $t("hi") }}</span>
        <span class="welcomeMessage_name">{{ currentUser.username }}!</span>
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
    <img :src="selectedFox" alt="Lisek" class="mainFox" />
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

  .controls {
    position: absolute;
    bottom: 0;
    right: 12px;
    &_btn {
      padding: 12px 20px;
      margin-bottom: 8px;
      width: 164px;
    }
  }
}
</style>
