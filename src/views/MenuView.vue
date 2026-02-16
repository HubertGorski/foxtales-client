<script setup lang="ts">
  import { CREATE_GAME, ROUTE_PATH } from '@/router/routeEnums';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import HubAccordionElement from '@/components/hubComponents/HubAccordionElement.vue';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { userService } from '@/api/services/UserService';
  import { User } from '@/models/User';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { Game } from '@/models/Game';

  const userStore = useUserStore();
  const router = useRouter();
  const signalRStore = useSignalRStore();

  const navigateToJoinGame = async () => {
    const success = await signalRStore.goToJoinGameView();
    if (!success) {
      return;
    }

    router.push(ROUTE_PATH.JOIN_GAME);
  };

  const navigateToCreateGame = async () => {
    const success = await signalRStore.createRoom(new Game(userStore.user));
    if (!success) {
      return;
    }

    router.push({
      path: ROUTE_PATH.CREATE_GAME,
      query: {
        catalog: CREATE_GAME.PUBLIC,
      },
    });
  };

  const goToLibrary = () => {
    router.push(ROUTE_PATH.LIBRARY);
  };

  const logout = async () => {
    router.push(ROUTE_PATH.HOME);
    await userService.logout();
    userStore.setUserSession(new User());
  };
</script>

<template>
  <div class="menuView">
    <div class="menu">
      <div class="welcomeMessage">
        <span class="welcomeMessage_greeting">{{ $t('hi') }}</span>
        <span class="welcomeMessage_name">{{ userStore.user.username }}!</span>
        <p class="welcomeMessage_text">{{ $t('haveFunAndEnjoyGame') }}</p>
      </div>
      <HubAccordionElement title="createNewGame" @click="navigateToCreateGame" />
      <HubAccordionElement title="joinTheGame" @click="navigateToJoinGame" />
      <div class="menu_elementWithFox" @click="goToLibrary">
        <img class="fox" src="@/assets/imgs/7.webp" alt="Lisek" />
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
  @use '@/assets/styles/variables' as *;

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
        white-space: nowrap;

        &_greeting {
          font-size: 56px;
          line-height: 64px;
          color: $grayColor;
        }

        &_name {
          display: block;
          width: 100%;
          font-size: 3em;
          max-height: 148px;
          line-height: 64px;
          color: $mainOrangeColor;
          overflow-x: auto;
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
      bottom: 0;
      z-index: 2;
      max-height: 152px;
    }

    .navigationBtns {
      padding-left: 160px;
      position: absolute;
      bottom: 8px;
      right: 12px;
    }
  }
</style>
