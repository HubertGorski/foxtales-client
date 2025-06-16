<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { PERMISSION_GAME } from "@/enums/permissions";
import { ROUTE_PATH } from "@/router/routeEnums";
import foxGames from "@/configs/foxGames";
import { SESSION_STORAGE } from "@/enums/sessionStorageEnum";

const router = useRouter();
const userStore = useUserStore();
const confirmationTarget = sessionStorage.getItem(
  SESSION_STORAGE.URL_SELECTED_GAME
);
if (!confirmationTarget) {
  router.push(ROUTE_PATH.MENU);
}

const action = (id: PERMISSION_GAME) => {
  sessionStorage.setItem(SESSION_STORAGE.IS_GAME_SELECTED, "true");
  router.push(`${confirmationTarget}-${id}`);
  sessionStorage.removeItem(SESSION_STORAGE.URL_SELECTED_GAME);
};
</script>

<template>
  <div class="chooseGameView">
    <div class="title">{{ $t("chooseGameType") }}</div>
    <div class="chooseGame">
      <div v-for="game in foxGames" :key="game.permission">
        <div
          @click="action(game.permission)"
          class="creamCard chooseGame_game"
          :class="{
            isLocked: !userStore.getPermissionByName(game.permission)
              .isGameUnlocked,
          }"
        >
          <v-icon class="icon">{{ game.icon }}</v-icon>
          <div class="name">{{ $t(game.name) }}</div>
        </div>
      </div>
    </div>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.chooseGameView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;

  .title {
    font-weight: 600;
    font-size: 32px;
    line-height: 64px;
    color: $grayColor;
  }

  .chooseGame {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;

    &_game {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 24px;
      padding: 24px;
      margin: 12px 0;
      color: $mainBrownColor;
      font-weight: 600;
      gap: 8px;

      &.isLocked {
        color: $lightGrayColor;
        pointer-events: none;
        opacity: 0.8;
      }

      .icon {
        font-size: 48px;
      }
    }
  }
}
</style>
