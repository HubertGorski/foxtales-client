<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
import { ICON } from "@/enums/iconsEnum";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { PERMISSION_GAME } from "@/enums/permissions";

const router = useRouter();
const currentUser = useUserStore();

const games = [
  {
    id: PERMISSION_GAME.PSYCH,
    name: "Opowieści",
    icon: ICON.GAME_PSYCH,
    description: "Opis gry psych",
    isAvailable: currentUser.getPermissionByName(PERMISSION_GAME.PSYCH)
      .isGameUnlocked,
  },
  {
    id: PERMISSION_GAME.DYLEMATY,
    name: "Dylematy",
    icon: ICON.GAME_DYLEMATY,
    description: "Opis gry dylematy",
    isAvailable: currentUser.getPermissionByName(PERMISSION_GAME.DYLEMATY)
      .isGameUnlocked,
  },
  {
    id: PERMISSION_GAME.KILLGAME,
    name: "Kill game",
    icon: ICON.GAME_KILLGAME,
    description: "Opis gry kill game",
    isAvailable: currentUser.getPermissionByName(PERMISSION_GAME.KILLGAME)
      .isGameUnlocked,
  },
];

const action = (id: PERMISSION_GAME) => {
  const confirmationTarget = sessionStorage.getItem("targetUrl");
  if (!confirmationTarget) {
    return;
  }

  sessionStorage.setItem("isGameSelected", "true");
  router.push(`${confirmationTarget}-${id}`);
  sessionStorage.removeItem("targetUrl");
};
</script>

<template>
  <div class="chooseGameView">
    <div class="title">{{ $t("chooseGameType") }}</div>
    <div class="chooseGame">
      <div v-for="game in games" :key="game.id">
        <div
          @click="action(game.id)"
          class="creamCard chooseGame_game"
          :class="{ isLocked: !game.isAvailable }"
        >
          <v-icon class="icon">{{ game.icon }}</v-icon>
          <div class="name">{{ game.name }}</div>
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
