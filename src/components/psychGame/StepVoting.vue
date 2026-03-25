<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, onUnmounted, ref, toRef } from 'vue';
  import UserListElement from '../UserListElement.vue';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import HubDivider from '../hubComponents/HubDivider.vue';
  import { Game } from '@/models/Game';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/stores/userStore';
  import { shuffleArray } from '@/utils/mathUtils';
  import type { User } from '@/models/User';
  import { getAvatar, getUnknownAvatar } from '@/utils/imgUtils';
  import CurrentQuestion from '../CurrentQuestion.vue';
  import HubTooltip from '../hubComponents/HubTooltip.vue';
  import { RULES } from '@/enums/rulesEnum';
  import { VIEW } from '@/enums/viewsEnum';
  import HubDialogPopup from '../hubComponents/HubDialogPopup.vue';
  import type { Answer } from '@/models/Answer';
  import { ICON } from '@/enums/iconsEnum';
  import { useViewStore } from '@/stores/viewStore';
  import HubSwitchBtn from '../hubComponents/HubSwitchBtn.vue';
  import ShareMemoryPopup from './ShareMemoryPopup.vue';

  const { t } = useI18n();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();
  const viewStore = useViewStore();

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const currentUserId = computed(() => userStore.user.userId);

  const isUserReady = computed(() =>
    game.value.isCurrentView(currentUserId.value, VIEW.SELECT_ANSWER_WAITING_FOR_USERS)
  );

  const showOwnersStep = computed(() =>
    game.value.isCurrentView(currentUserId.value, VIEW.SHOW_OWNERS)
  );

  const selectedAnswerUserIds = ref<number[]>(
    game.value.getSelectedAnswerUserIds(currentUserId.value)
  );

  const showConfirmEmptySelectPanel = ref<boolean>(false);
  const showOriginalAnswers = ref<boolean>(false);
  const isMemoriesCardAvailable = ref<boolean>(false);

  const timeLeft = ref(0);
  let timerId: number = 0;
  const isQuietDaysMode = computed(() => game.value.currentRules === RULES.QUIET_DAYS);
  const isSubjectPlayer = computed(
    () => currentUserId.value === game.value.currentQuestion?.currentUser?.userId
  );
  const currentPlayer = computed(() =>
    game.value.users.find(user => user.userId === currentUserId.value)
  );

  onBeforeMount(() => {
    if (
      showOwnersStep.value &&
      game.value.hasRoundShared &&
      currentPlayer.value?.hasRoundSaved &&
      game.value.shareKey
    ) {
      userStore.revealUsersInMemory(game.value.shareKey, game.value.round);
    }

    if (!signalRStore.userIdsOrderList.length && game.value.users.length > 0) {
      signalRStore.userIdsOrderList = shuffleArray(game.value.users).map(user => user.userId);
    }
  });

  const shuffledUsers = computed<User[]>(() => {
    const orderMap = new Map(signalRStore.userIdsOrderList.map((id, index) => [id, index]));
    return [...game.value.users].sort((a, b) => {
      const aIndex = orderMap.get(a.userId) ?? Infinity;
      const bIndex = orderMap.get(b.userId) ?? Infinity;
      return aIndex - bIndex;
    });
  });

  onMounted(async () => {
    if (isQuietDaysMode.value && !showOwnersStep.value && !isSubjectPlayer.value) {
      await selectAndConfirmEmptySelect();
    }

    if (isUserReady.value) {
      return;
    }

    if (isQuietDaysMode.value) {
      timeLeft.value = 5;
    }

    timerId = setInterval(() => {
      if (timeLeft.value <= 0) {
        clearInterval(timerId);
        return;
      }

      timeLeft.value--;
    }, 1000);
  });

  onUnmounted(() => {
    clearInterval(timerId);
  });

  const activeUser = computed(() => game.value.users.find(u => u.userId === currentUserId.value)!);

  const confirmSelectedAnswer = async () => {
    if (!selectedAnswerUserIds.value.length && !isQuietDaysMode.value) {
      return;
    }

    if (!selectedAnswerUserIds.value.length && isQuietDaysMode.value && isSubjectPlayer.value) {
      showConfirmEmptySelectPanel.value = true;
      return;
    }

    await confirmSelectedAnswers();
  };

  const selectAndConfirmEmptySelect = async () => {
    await signalRStore.chooseAnswer(currentUserId.value, []);
  };

  const selectAndConfirmAllAnswers = async () => {
    for (const user of userList.value) {
      selectedAnswerUserIds.value.push(user.userId);
    }

    await confirmSelectedAnswers();
  };

  const confirmEmptySelectAnswer = async () => {
    showConfirmEmptySelectPanel.value = false;
    await confirmSelectedAnswers();
  };

  const confirmSelectedAnswers = async () => {
    await signalRStore.chooseAnswer(currentUserId.value, selectedAnswerUserIds.value);
  };

  const selectAnswer = (userId: number | null) => {
    if (isUserReady.value || showOwnersStep.value || !userId || isDuoGame.value) {
      return;
    }

    if (isQuietDaysMode.value && currentUserId.value === userId) {
      return;
    }

    if (isQuietDaysMode.value && !isSubjectPlayer.value) {
      return;
    }

    if (isSelected(userId)) {
      selectedAnswerUserIds.value = selectedAnswerUserIds.value.filter(id => id !== userId);
    } else {
      if (selectedAnswerUserIds.value.length && !isQuietDaysMode.value) {
        selectedAnswerUserIds.value = [];
      }

      selectedAnswerUserIds.value.push(userId);
    }
  };

  const isSelected = (userId: number): boolean => {
    if (isDuoGame.value) {
      return false;
    }

    return selectedAnswerUserIds.value.includes(userId);
  };

  const getLabel = (user: User): string => {
    if (!user.answer) {
      return '';
    }

    if (!isQuietDaysMode.value) {
      return showOwnersStep.value ? `${t('votersCount')} ${user.answer.votersCount}` : '';
    }

    return showOwnersStep.value &&
      (user.answer.votersCount > 0 ||
        user.userId === game.value.currentQuestion?.currentUser?.userId)
      ? `${t('correctAnswer')}`
      : '';
  };

  const chooseAnswerText = computed(() => {
    if (showOwnersStep.value) {
      return isQuietDaysMode.value ? t('results') : t('voteResults');
    }

    if (!isQuietDaysMode.value) {
      return isUserReady.value ? t('waitForVotes') : t('chooseAnswer');
    }

    if (isSubjectPlayer.value) {
      const chooseAnswerText = isDuoGame.value ? '' : t('chooseCorrectAnswers');
      return isUserReady.value ? t('lobby.waitingForPlayers') : chooseAnswerText;
    }

    const waitingText = isDuoGame.value ? '' : t('lobby.waitingForPlayers');
    return isUserReady.value ? waitingText : t('moveOn');
  });

  const isDuoGame = computed(() => {
    if (!isQuietDaysMode.value) {
      // TODO: na razie jest załóżenie że tylko dla tego trybu można grać w 2 osoby
      return false;
    }
    return isSubjectPlayer.value ? userList.value.length === 1 : userList.value.length === 2;
  });

  const isWaitingForResults = computed(() => {
    return isQuietDaysMode.value && !isSubjectPlayer.value;
  });

  const userList = computed(() => {
    if (!isQuietDaysMode.value || !isSubjectPlayer.value) {
      return shuffledUsers.value;
    }

    return shuffledUsers.value.filter(u => u.userId !== currentUserId.value);
  });

  const confirmBtnText = computed(() => {
    if (timeLeft.value && isSubjectPlayer.value && isQuietDaysMode.value) {
      return `${t('chooseCorrectAnswers')} (${timeLeft.value})`;
    }

    if (isWaitingForResults.value) {
      return t('waitingForResults');
    }

    return isUserReady.value ? t('accepted') : t('accept');
  });

  const confirmBtn = computed(() => {
    return {
      text: confirmBtnText.value,
      isOrange: true,
      action: confirmSelectedAnswer,
      disabled:
        (!selectedAnswerUserIds.value.length && !isQuietDaysMode.value) ||
        isUserReady.value ||
        isWaitingForResults.value ||
        (timeLeft.value > 0 && isSubjectPlayer.value && isQuietDaysMode.value),
    };
  });

  const questionText = computed((): string => game.value.currentQuestion?.text ?? '');

  const nextPageBtn = computed(() => {
    return {
      text: 'next',
      isOrange: true,
      action: () => {
        signalRStore.GoToResults(currentUserId.value);
      },
      disabled: false,
    };
  });

  const areSwitchLangAnswersVisible = computed((): boolean => {
    return (
      userStore.user.useAiTranslations &&
      userList.value.some(user => Object.keys(user.answer?.answerInOtherLanguages ?? {}).length > 0)
    );
  });

  const getAnswerText = (answer: Answer | null): string => {
    if (
      userStore.user.useAiTranslations &&
      answer?.answerInOtherLanguages &&
      !showOriginalAnswers.value
    ) {
      return answer.answerInOtherLanguages[userStore.user.language] ?? answer.answer;
    }

    return answer?.answer ?? '';
  };

  const getAvatarLabel = (user: User): string => {
    const username = currentUserId.value === user.userId ? t('you') : user.username;
    return showOwnersStep.value || isDuoGame.value ? username : '';
  };

  const switchLangAnswers = (): void => {
    showOriginalAnswers.value = !showOriginalAnswers.value;
    viewStore.setInfo(
      showOriginalAnswers.value ? 'info.translateAnswersOff' : 'info.translateAnswersOn'
    );
  };
</script>

<template>
  <div class="stepVoting">
    <div class="header">
      <HubDivider :text="chooseAnswerText" />
      <CurrentQuestion
        :isFoxVisible="false"
        :question="questionText"
        :avatarId="game.currentQuestion?.currentUser?.avatar.id ?? 0"
        :username="game.currentQuestion?.currentUser?.username ?? ''"
      />
    </div>
    <div class="answers">
      <UserListElement
        v-if="isQuietDaysMode && isSubjectPlayer"
        :text="activeUser.answer?.answer ?? ''"
        :avatarLabel="$t('you')"
        :label="showOwnersStep ? `${$t('correctAnswer')}` : ''"
        :imgSource="getAvatar(activeUser.avatar.id)"
        :isSelected="!isDuoGame"
        :teamId="activeUser.teamId"
        isSelectedBold
        @click="selectAnswer(activeUser.userId)"
      />
      <HubDivider
        v-if="isDuoGame && isSubjectPlayer"
        class="pt-6"
        :text="$t('isGivenAnswerCorrect')"
      />
      <UserListElement
        v-for="user in userList.filter(user => user.answer)"
        :key="user.userId"
        :text="getAnswerText(user.answer)"
        :avatarLabel="getAvatarLabel(user)"
        :label="getLabel(user)"
        :isSelected="isSelected(user.userId)"
        :imgSource="showOwnersStep || isDuoGame ? getAvatar(user.avatar.id) : getUnknownAvatar()"
        :teamId="showOwnersStep || isDuoGame ? user.teamId : 0"
        isSelectedBold
        @click="selectAnswer(user.userId)"
      />
    </div>
    <div class="bottomPanelWithBtns">
      <div v-if="!showOwnersStep" class="w-100">
        <div v-if="isDuoGame && isSubjectPlayer" class="trueFalsePanel">
          <div class="trueFalsePanel_btn">
            <img src="@/assets/imgs/psych/false.webp" alt="Lisek" class="fox" />
            <HubBtn text="false" :action="selectAndConfirmEmptySelect" />
          </div>
          <div class="trueFalsePanel_btn">
            <img src="@/assets/imgs/psych/true.webp" alt="Lisek" class="fox" />
            <HubBtn text="true" isOrange :action="selectAndConfirmAllAnswers" />
          </div>
        </div>
        <div v-else class="acceptPanel">
          <HubTooltip
            :tooltipText="isUserReady ? 'isAnswerPicked' : 'selectFavAnswer'"
            :tooltipDisabled="!confirmBtn.disabled || isQuietDaysMode"
          >
            <HubBtn
              :action="confirmBtn.action"
              :text="confirmBtn.text"
              :isOrange="confirmBtn.isOrange"
              :disabled="confirmBtn.disabled"
              :useDicts="false"
            />
          </HubTooltip>
        </div>
      </div>
      <div v-else class="nextPageBtn acceptPanel">
        <HubBtn
          :action="nextPageBtn.action"
          :text="nextPageBtn.text"
          :isOrange="nextPageBtn.isOrange"
          :disabled="nextPageBtn.disabled"
        />
      </div>
      <div class="bottomPanelWithBtns_btns" :class="{ btnCenter: isDuoGame && isSubjectPlayer }">
        <HubBtn
          :action="() => (isMemoriesCardAvailable = true)"
          :icon="ICON.MEMORIES"
          hubSwitchStyle
        />
        <HubSwitchBtn
          v-if="areSwitchLangAnswersVisible"
          :initState="showOriginalAnswers"
          :action="switchLangAnswers"
          :iconOff="ICON.TRANSLATE_OFF"
          :iconOn="ICON.TRANSLATE_ON"
          iconSize="32"
        />
      </div>
    </div>
    <HubDialogPopup
      v-model="showConfirmEmptySelectPanel"
      :textPopup="$t('confirmEmptySelectAnswerPopup')"
      backBtnText="cancel"
      confirmBtnText="continue"
      :confirmAction="confirmEmptySelectAnswer"
    />
    <ShareMemoryPopup v-model="isMemoriesCardAvailable" :game="game" />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .stepVoting {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    padding-top: 0;

    .header {
      width: 100%;
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .answers {
      overflow: scroll;
      display: flex;
      flex-direction: column;
      padding: 8px;
      width: 100%;
    }

    .bottomPanelWithBtns {
      position: relative;
      display: flex;
      align-items: end;
      width: 100%;

      &_btns {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 0;

        &.btnCenter {
          position: absolute;
          bottom: 58px;
          right: 50%;
          transform: translateX(50%);
        }
      }
    }

    .trueFalsePanel {
      display: flex;
      justify-content: space-around;
      gap: 12px;

      &_btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        img {
          max-width: 152px;
          transform: translateY(14px);
        }
      }
    }

    .acceptPanel {
      padding: 8px 16px;
      width: 100%;

      .hubBtn {
        padding: 8px;
        margin: 4px auto 0;
      }
    }

    .nextPageBtn {
      width: 100%;
      padding-top: 8px;

      .hubBtn {
        padding: 8px;
        margin: 0 auto;
      }
    }
  }
</style>
