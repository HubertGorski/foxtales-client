<script setup lang="ts">
  import UserListElement from '@/components/UserListElement.vue';
  import { computed, ref, toRef, watch } from 'vue';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { Game } from '@/models/Game';
  import { useUserStore } from '@/stores/userStore';
  import { NO_ACCESS_REASON } from '@/enums/noAccessReasonEnum';
  import SelectQuestionsPanel, {
    type SelectedQuestions,
  } from '@/components/SelectQuestionsPanel.vue';
  import HubPopup from '@/components/hubComponents/HubPopup.vue';
  import { ICON } from '@/enums/iconsEnum';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import { useI18n } from 'vue-i18n';
  import type { Question } from '@/models/Question';
  import HubCounterWithTitle from '@/components/hubComponents/HubCounterWithTitle.vue';
  import { getAvatar } from '@/utils/imgUtils';
  import { RULES } from '@/enums/rulesEnum';
  import type { User } from '@/models/User';
  import { VIEW } from '@/enums/viewsEnum';

  const router = useRouter();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();
  const { t } = useI18n();

  const usePrivateQuestions = ref<boolean>(false);
  const showSettingsPanel = ref<boolean>(false);
  const showTeamsPanel = ref<boolean>(false);
  const currentQuestions = ref<Question[]>([]);

  const currentUserId = computed(() => userStore.user.userId);
  const isUserReady = computed(() => game.value.isUserReady(currentUserId.value, VIEW.ADD_ANSWER));

  const leaveRoom = async () => {
    const success = await signalRStore.leaveRoom(userStore.user.userId);
    if (!success) {
      return;
    }

    router.push(ROUTE_PATH.MENU);
  };

  const goToSettings = async () => {
    router.back();
  };

  const arrowLeftClicked = async (user: User) => {
    let teamId: number | null = null;
    if (!user.teamId) {
      teamId = game.value.users.length;
      await signalRStore.setTeam(user.userId, teamId);
      return;
    }

    teamId = user.teamId - 1;

    if (teamId === 0) {
      teamId = null;
    }

    await signalRStore.setTeam(user.userId, teamId);
  };

  const arrowRightClicked = async (user: User) => {
    let teamId: number | null = null;
    if (!user.teamId) {
      teamId = 1;
      await signalRStore.setTeam(user.userId, teamId);
      return;
    }

    teamId = user.teamId + 1;

    if (teamId === game.value.users.length + 1) {
      teamId = null;
    }

    await signalRStore.setTeam(user.userId, teamId);
  };

  const goToGame = async () => {
    await signalRStore.startGame();
  };

  const setReady = async () => {
    await signalRStore.setReadyForAddAnswer(userStore.user.userId);
  };

  const setUnready = async () => {
    await signalRStore.setUnreadyForAddAnswer(userStore.user.userId);
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
      return goToGame();
    }

    if (isUserReady.value) {
      setUnready();
    } else {
      setReady();
    }
  };

  const setCurrentQuestions = async (questions: SelectedQuestions) => {
    currentQuestions.value = questions.questions;
    userStore.user.chosenQuestionsSource = questions.source;
    userStore.user.chosenCatalogId = questions.chosenCatalogId;
  };

  const addPrivateQuestionsToGame = async () => {
    const success = await signalRStore.addPrivateQuestionsToGame(
      userStore.user.userId,
      currentQuestions.value
    );
    if (!success) {
      return;
    }

    showSettingsPanel.value = false;
  };

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const isMinimalViewMode = computed(() => {
    return game.value.users.length > 4;
  });

  const isOwner = computed(() => {
    return game.value.owner.userId === userStore.user.userId;
  });

  const optionBtn = computed(() => {
    return {
      text: isOwner.value ? 'settings' : 'back',
      isOrange: false,
      action: optionBtnAction,
    };
  });

  const tooltipText = computed(() => {
    if (!game.value.questions.length && isOwner.value) {
      return 'tooltip.toStartGameChooseQuestions';
    }

    if (game.value.getAreUsersUnready(VIEW.ADD_ANSWER) && isOwner.value) {
      return 'tooltip.startNewGame';
    }

    return '';
  });

  const startBtn = computed(() => {
    return {
      text: isOwner.value ? 'start' : 'ready',
      action: startBtnAction,
      tooltipText: tooltipText.value,
      disabled:
        (game.value.getAreUsersUnready(VIEW.ADD_ANSWER) && isOwner.value) ||
        (!game.value.questions.length && !game.value.usePublicQuestions && isOwner.value),
    };
  });

  const isUserReadyForNewRound = (userId: number): boolean => {
    return game.value.isUserReady(userId, VIEW.ADD_ANSWER);
  };

  if (!game.value.users.length) {
    router.push(ROUTE_PATH.JOIN_GAME);
  }

  watch(
    game,
    (game: Game | null) => {
      if (game == null || game.code == null) {
        router.push({
          path: ROUTE_PATH.NO_ACCESS,
          query: { reason: NO_ACCESS_REASON.GAME_CLOSED },
        });
      }

      if (game?.isGameStarted) {
        router.push(ROUTE_PATH.GAME_PSYCH);
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="lobbyView">
    <HubCounterWithTitle
      :value="game.getReadyUsersCount(VIEW.ADD_ANSWER)"
      :maxValue="game.usersCount"
      :title="$t('lobby.waitingForPlayers')"
    />
    <div class="lobbyView_userList" :class="{ isMinimalViewMode: isMinimalViewMode }">
      <UserListElement
        v-for="user in game.users"
        :key="user.userId"
        :imgSource="getAvatar(user.avatar.id)"
        :isSelected="isUserReadyForNewRound(user.userId)"
        :text="user.username"
        :teamId="user.teamId"
      />
    </div>
    <div class="buttons">
      <div class="buttons_settingsBtnWithCode">
        <div>
          <span class="icon">!</span>
          <span class="code">{{ t('lobby.accessCode') }} {{ game.code }}</span>
        </div>
        <HubBtn
          v-if="
            game.owner.userId !== userStore.user.userId && game.isQuestionsFromAnotherGamesAllowed
          "
          class="settingsBtn"
          :action="() => (showSettingsPanel = true)"
          :icon="ICON.ADD_TO_COLLECTION"
        />
        <HubBtn
          v-if="isOwner && game.currentRules == RULES.QUIET_DAYS"
          class="settingsBtn"
          :action="() => (showTeamsPanel = true)"
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
        :btn2isClicked="isUserReady"
      />
    </div>
    <HubPopup v-model="showSettingsPanel">
      <div class="settings creamCard">
        <span class="settings_title">{{ $t('userSettings') }}</span>
        <SelectQuestionsPanel
          v-model:usePrivateQuestions="usePrivateQuestions"
          @setQuestions="setCurrentQuestions"
        />
        <HubBtn class="settings_btn" text="accept" :action="addPrivateQuestionsToGame" />
      </div>
    </HubPopup>
    <HubPopup v-model="showTeamsPanel">
      <div class="settings creamCard">
        <span class="settings_title">{{ $t('teamsSettings') }}</span>
        <UserListElement
          v-for="user in game.users"
          :key="user.userId"
          :imgSource="getAvatar(user.avatar.id)"
          :text="user.username"
          :label="user.teamId ? `${t('team')} ${user.teamId}` : t('noTeam')"
          showArrowsLabel
          @arrowLeftClicked="arrowLeftClicked(user)"
          @arrowRightClicked="arrowRightClicked(user)"
        />
      </div>
    </HubPopup>
  </div>
</template>

<style lang="scss">
  @import '@/assets/styles/variables';
  .lobbyView {
    background: $mainBackground;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;

    .settings {
      padding: 12px;
      min-width: 360px;
      max-height: 90vh;
      overflow-y: scroll;

      .userListElement_text {
        background-color: white;
      }

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
        overflow-y: auto;
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
