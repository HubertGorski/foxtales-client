<script setup lang="ts">
import UserListElement from "@/components/UserListElement.vue";
import { computed, ref, toRef, watch } from "vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { Game } from "@/models/Game";
import { useUserStore } from "@/stores/userStore";
import { NO_ACCESS_REASON } from "@/enums/noAccessReasonEnum";
import SelectQuestionsPanel from "@/components/SelectQuestionsPanel.vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import { ICON } from "@/enums/iconsEnum";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useI18n } from "vue-i18n";
import type { Question } from "@/models/Question";

const router = useRouter();
const signalRStore = useSignalRStore();
const userStore = useUserStore();
const { t } = useI18n();

const usePrivateQuestions = ref<boolean>(false);
const showSettingsPanel = ref<boolean>(false);
const currentQuestions = ref<Question[]>([]);

const leaveRoom = async () => {
  await signalRStore.leaveRoom(userStore.user.userId);
  router.push(ROUTE_PATH.MENU);
};

const goToSettings = async () => {
  router.push(ROUTE_PATH.CREATE_GAME_PSYCH);
};

const goToGame = async () => {
  await signalRStore.removeRoom(); // TODO: usuanc jak zaczne robic gre
  router.push(ROUTE_PATH.GAME_PSYCH);
};

const setReady = async () => {
  userStore.user.isReady = !userStore.user.isReady;
  await signalRStore.setStatus(userStore.user.userId, userStore.user.isReady);
};

const optionBtnAction = async () => {
  if (isOwner.value) {
    goToSettings();
  } else {
    await leaveRoom();
  }
};

const startBtnAction = async () => {
  if (isOwner.value) {
    goToGame();
  } else {
    setReady();
  }
};

const setCurrentQuestions = async (questions: Question[]) => {
  currentQuestions.value = questions;
};

const addQuestionsToGame = async () => {
  await signalRStore.addQuestionsToGame(
    userStore.user.userId,
    currentQuestions.value
  );
  showSettingsPanel.value = false;
};

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const isMinimalViewMode = computed(() => {
  return game.value.users.length > 4;
});

const isOwner = computed(() => {
  return game.value.owner.userId === userStore.user.userId;
});

const optionBtn = computed(() => {
  return {
    text: isOwner.value ? "settings" : "back",
    isOrange: false,
    action: optionBtnAction,
  };
});

const startBtn = computed(() => {
  return {
    text: isOwner.value ? "start" : "ready",
    action: startBtnAction,
    tooltipText: isOwner.value ? "tooltip.startNewGame" : "",
    disabled:
      game.value.areUsersUnready &&
      game.value.owner.userId === userStore.user.userId,
  };
});

if (!game.value.users.length) {
  router.push(ROUTE_PATH.JOIN_GAME);
}

watch(game, (game: Game | null) => {
  if (game == null || game.code == null) {
    router.push({
      path: ROUTE_PATH.NO_ACCESS,
      query: { reason: NO_ACCESS_REASON.GAME_CLOSED },
    });
  }
});
</script>

<template>
  <div class="lobbyView">
    <div class="header">
      <p class="header_title">{{ $t("lobby.waitingForPlayers") }}</p>
      <p class="header_counter">
        ({{ game.readyUsersCount }} / {{ game.usersCount }})
      </p>
    </div>
    <!-- TODO: do testow, usunac normalnie -->
    {{ game.questions.map(q => q.id) }}
    <div
      class="lobbyView_userList"
      :class="{ isMinimalViewMode: isMinimalViewMode }"
    >
      <user-list-element
        v-for="user in game.users"
        :key="user.userId"
        :user="user"
      />
    </div>
    <div class="buttons">
      <div class="buttons_settingsBtnWithCode">
        <div>
          <span class="icon">!</span>
          <span class="code">{{ t("lobby.accessCode") }} {{ game.code }}</span>
        </div>
        <HubBtn
          v-if="game.owner.userId !== userStore.user.userId && game.isQuestionsFromAnotherGamesAllowed"
          class="settingsBtn"
          :action="() => (showSettingsPanel = true)"
          :icon="ICON.ADD_TO_COLLECTION"
        />
      </div>
      <NavigationBtns
        :btn="optionBtn.text"
        :btnIsOrange="optionBtn.isOrange"
        :btnCustomAction="optionBtn.action"
        :btn2="startBtn.text"
        :btn2Disabled="startBtn.disabled"
        :btn2TooltipText="startBtn.tooltipText"
        :btn2CustomAction="startBtn.action"
        :btn2isSwitch="!isOwner"
      />
    </div>
    <HubPopup v-model="showSettingsPanel">
      <div class="settings creamCard">
        <span class="settings_title">{{ $t("userSettings") }}</span>
        <SelectQuestionsPanel
          v-model:usePrivateQuestions="usePrivateQuestions"
          @setQuestions="setCurrentQuestions"
        />
        <HubBtn
          class="settings_btn"
          text="accept"
          :action="addQuestionsToGame"
        />
      </div>
    </HubPopup>
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

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $mainBrownColor;
    font-weight: 600;
    width: 100%;

    &_title {
      font-size: 24px;
    }

    &_counter {
      font-size: 18px;
    }
  }

  .settings {
    padding: 12px;

    &_title {
      font-weight: 600;
      font-size: 24px;
      color: $grayColor;
    }

    &_btn {
      padding: 8px;
      font-size: 16px;
    }
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

  .buttons {
    width: 100%;

    &_settingsBtnWithCode {
      display: flex;
      justify-content: center;
      align-items: end;
      width: 100%;
      padding: 12px 0;

      .icon {
        position: relative;
        top: 4px;
        right: 4px;
        font-size: 32px;
        font-weight: 900;
        color: $mainBrownColor;
      }

      .code {
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

      .settingsBtn {
        margin: 0 8px;
        padding: 4px;
        width: 52px;
      }
    }
  }
}
</style>
