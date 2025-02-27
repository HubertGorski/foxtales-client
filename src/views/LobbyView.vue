<script setup lang="ts">
import UserListElement from "@/components/UserListElement.vue";
import { users } from "@/assets/data/users";
import { computed, ref } from "vue";
import { Game } from "@/models/Game";
import NavigationBtns from "@/components/NavigationBtns.vue";

const isZoom = ref<boolean>(false);

const game = ref(new Game("PIESEK1"));
game.value.users = users;

const customCodeLabel = computed(() => {
  return isZoom.value ? game.value.code : `Kod dostępu: ${game.value.code}`;
});

const isMinimalViewMode = computed(() => {
  return game.value.users.length > 4;
});
</script>

<template>
  <div class="lobbyView">
    <div class="lobbyView_header">
      <p class="title">Oczekiwanie na graczy</p>
      <p class="counter">
        ({{ game.readyUsersCount }} / {{ game.usersCount }})
      </p>
    </div>
    <img
      v-if="game.users.length === 0"
      src="@/assets/imgs/fox3.png"
      alt="Lisek"
      class="lobbyView_emptyUserList"
    />
    <div
      v-else
      :class="{ isMinimalViewMode: isMinimalViewMode }"
      class="lobbyView_userList"
    >
      <div v-for="user in game.users" :key="user.userId">
        <user-list-element :user="user" />
      </div>
    </div>
    <div
      @click="isZoom = !isZoom"
      :class="{ mask: isZoom && !game.isPublic }"
    ></div>
    <div
      @click="isZoom = !isZoom"
      :class="{ zoomCustomCodeSection: isZoom && !game.isPublic }"
    >
      <span v-if="!isZoom && !game.isPublic" class="icon">!</span>
      <span v-if="!game.isPublic" class="customCodeSection">{{
        customCodeLabel
      }}</span>
    </div>
    <span v-if="isZoom && !game.isPublic" class="isZoom"></span>
    <NavigationBtns
      btn="closeGame"
      btn2="start"
      :btn2Disabled="game.areUsersUnready"
      btn2TooltipText="tooltip.startNewGame"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.lobbyView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  .zoomCustomCodeSection {
    transform: translate(5px, -276px) scale(3);
    z-index: 3;
    transition: all 0.4s;
  }
  .isZoom {
    height: 24px;
  }
  .mask {
    content: "";
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    transition: all 0.4s;
  }

  .icon {
    position: relative;
    top: 4px;
    right: 4px;
    font-size: 32px;
    font-weight: 900;
    color: $mainBrownColor;
  }

  .customCodeSection {
    background-color: $background;
    color: $mainBrownColor;
    font-size: 24;
    font-weight: 600;
    text-align: center;
    padding: 8px 20px;
    border-radius: 12px;
    border: 2px solid $mainBrownColor;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 10px auto;
    width: fit-content;
  }

  &_header {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $mainBrownColor;
    font-weight: 600;

    .title {
      font-size: 24px;
    }

    .counter {
      font-size: 18px;
    }
  }

  &_emptyUserList {
    height: 450px;
  }

  &_userList {
    display: flex;
    flex-direction: column;
    height: 450px;
    justify-content: center;

    &.isMinimalViewMode {
      justify-content: space-between;
      overflow-y: scroll;
    }
  }
}
</style>
