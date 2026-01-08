<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
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

  const { t } = useI18n();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const currentUserId = computed(() => userStore.user.userId);

  const isUserReady = computed(() =>
    game.value.isCurrentView(currentUserId.value, VIEW.SELECT_ANSWER_WAITING_FOR_USERS)
  );

  const showOwnersStep = computed(() =>
    game.value.isCurrentView(currentUserId.value, VIEW.SHOW_OWNERS)
  );

  const selectedAnswerUserIds = ref<number[]>([]);
  const timeLeft = ref(0);
  let timerId: number = 0;
  const shuffledUsers = ref<User[]>(shuffleArray(game.value.users));

  const isQuietDaysMode = computed(() => game.value.currentRules === RULES.QUIET_DAYS);
  const isSubjectPlayer = computed(
    () => currentUserId.value === game.value.currentQuestion?.currentUser?.userId
  );

  onMounted(() => {
    if (isQuietDaysMode.value) {
      timeLeft.value = 5;
    }

    timerId = setInterval(() => {
      timeLeft.value--;

      if (timeLeft.value <= 0) {
        clearInterval(timerId);
      }
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

    await signalRStore.chooseAnswer(currentUserId.value, selectedAnswerUserIds.value);
  };

  const selectAnswer = (userId: number | null) => {
    if (isUserReady.value || showOwnersStep.value || !userId) {
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
      return isUserReady.value ? t('lobby.waitingForPlayers') : t('chooseCorrectAnswers');
    }

    return isUserReady.value ? t('lobby.waitingForPlayers') : t('moveOn');
  });

  const userList = computed(() => {
    if (!isQuietDaysMode.value || !isSubjectPlayer.value) {
      return shuffledUsers.value;
    }

    return shuffledUsers.value.filter(u => u.userId !== currentUserId.value);
  });

  const confirmBtn = computed(() => {
    return {
      text:
        timeLeft.value && isSubjectPlayer.value && isQuietDaysMode.value
          ? `${t('chooseCorrectAnswers')} (${timeLeft.value})`
          : isQuietDaysMode.value && !isSubjectPlayer.value
            ? isUserReady.value
              ? 'lobby.waitingForPlayers'
              : 'checkResults'
            : isUserReady.value
              ? 'accepted'
              : 'accept',
      isOrange: true,
      action: confirmSelectedAnswer,
      disabled:
        (!selectedAnswerUserIds.value.length && !isQuietDaysMode.value) ||
        isUserReady.value ||
        (timeLeft.value > 0 && isSubjectPlayer.value && isQuietDaysMode.value),
    };
  });

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

  watch(
    game,
    (game: Game | null) => {
      if (game && showOwnersStep.value) {
        shuffledUsers.value = shuffledUsers.value.map(user => {
          const freshUser = game.users.find(u => u.userId === user.userId);
          return freshUser ? { ...user, ...freshUser } : user;
        });
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="stepVoting">
    <div class="header">
      <HubDivider :text="chooseAnswerText" />
      <CurrentQuestion
        :isFoxVisible="false"
        :question="game.currentQuestion?.text ?? ''"
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
        isSelected
        isSelectedBold
        @click="selectAnswer(activeUser.userId)"
      />
      <UserListElement
        v-for="user in userList"
        :key="user.userId"
        :text="user.answer?.answer ?? ''"
        :avatarLabel="showOwnersStep ? user.username : ''"
        :label="getLabel(user)"
        :isSelected="isSelected(user.userId)"
        :imgSource="showOwnersStep ? getAvatar(user.avatar.id) : getUnknownAvatar()"
        isSelectedBold
        @click="selectAnswer(user.userId)"
      />
    </div>
    <div v-if="!showOwnersStep" class="acceptPanel">
      <HubTooltip
        :tooltipText="isUserReady ? $t('isAnswerPicked') : $t('selectFavAnswer')"
        :tooltipDisabled="!confirmBtn.disabled || isQuietDaysMode"
      >
        <HubBtn
          :action="confirmBtn.action"
          :text="confirmBtn.text"
          :isOrange="confirmBtn.isOrange"
          :disabled="confirmBtn.disabled"
        />
      </HubTooltip>
    </div>
    <div v-else class="nextPageBtn">
      <HubBtn
        :action="nextPageBtn.action"
        :text="nextPageBtn.text"
        :isOrange="nextPageBtn.isOrange"
        :disabled="nextPageBtn.disabled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

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
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      padding: 8px;
      width: 100%;
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
