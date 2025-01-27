<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const navigateToJoinGame = () => {
  router.push(ROUTE_PATH.JOIN_GAME);
};

const navigateToCreateGame = () => {
  router.push(ROUTE_PATH.CREATE_GAME);
};

const currentUser = userStore.user;
const btns = [
  {
    id: 1,
    text: t("settings"),
    isOrange: true,
    action: () => router.push(ROUTE_PATH.SETTINGS)
  },
  {
    id: 2,
    text: t("logout"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.HOME)
  },
]
</script>

<template>
  <div class="menuView">
    <img src="@/assets/imgs/fox2.png" alt="Lisek" class="fox" />
    <div class="menu">
      <div class="welcomeMessage">
        <span class="welcomeMessage_greeting">Cześć </span>
        <span class="welcomeMessage_name">{{ currentUser.username }}!</span>
        <p class="welcomeMessage_text">Baw się dobrze i miłej gry.</p>
      </div>
      <div @click="navigateToCreateGame" class="menu_card">
        <h2>Utwórz nową grę</h2>
      </div>
      <div @click="navigateToJoinGame" class="menu_card">
        <h2>Dołącz do gry</h2>
      </div>
    </div>
    <div class="controls">
      <HubBtn class="controls_btn" :action="btns[0].action" :text="btns[0].text" :isOrange="btns[0].isOrange"/>
      <HubBtn class="controls_btn" :action="btns[1].action" :text="btns[1].text" :isOrange="btns[1].isOrange"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
.fox {
    position: absolute;
    bottom: -101px;
    left: -48px;
}

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

    &_card {
    padding: 24px;
    background: $background;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
    color: $grayColor;
    }

    .welcomeMessage {
      font-weight: 600;
      margin-bottom: 36px;

      &_greeting {
        font-size: 56px;
        line-height: 64px;
        color: $grayColor
      }
    
      &_name {
        display: block;
        width: 100%;
        font-size: 64px;
        line-height: 64px;
        color: $mainOrangeColor;
        overflow-x: scroll;
        overflow-y: hidden;
      }
    
      &_text {
        font-size: 14px;
        font-style: italic; 
        color: $lightGrayColor;  
        margin-top: 10px;
        letter-spacing: 0.5px; 
      }
    }
  }

  .controls {
    margin-left: 152px;
    &_btn {
      padding: 12px 20px;
      margin-bottom: 8px;
    }
  }
}
</style>
