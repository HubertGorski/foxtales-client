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

  const { t } = useI18n();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const emit = defineEmits<{
    (e: 'nextStep'): void;
  }>();

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const selectedAnswerUserIds = ref<number[]>([]);
  const isUserReady = ref<boolean>(false);
  const currentStep = ref<number>(0);
  const timeLeft = ref(0);
  let timerId: number = 0;
  const shuffledUsers = ref<User[]>(shuffleArray(game.value.users));

  const isQuietDaysMode = computed(() => game.value.currentRules === RULES.QUIET_DAYS);
  const isSubjectPlayer = computed(
    () => userStore.user.userId === game.value.currentQuestion?.currentUser?.userId
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

  const activeUser = computed(
    () => game.value.users.find(u => u.userId === userStore.user.userId)!
  );

  const confirmSelectedAnswer = async () => {
    if (!selectedAnswerUserIds.value.length && !isQuietDaysMode.value) {
      return;
    }

    const success = await signalRStore.chooseAnswer(
      userStore.user.userId,
      selectedAnswerUserIds.value
    );

    if (!success) {
      return;
    }

    isUserReady.value = true;
  };

  const selectAnswer = (userId: number | null) => {
    if (isUserReady.value || !userId) {
      return;
    }

    if (isQuietDaysMode.value && userStore.user.userId === userId) {
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
      return currentStep.value ? `${t('votersCount')} ${user.answer.votersCount}` : '';
    }

    return currentStep.value &&
      (user.answer.votersCount > 0 ||
        user.userId === game.value.currentQuestion?.currentUser?.userId)
      ? `${t('correctAnswer')}`
      : '';
  };

  const chooseAnswerText = computed(() => {
    if (currentStep.value !== 0) {
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

    return shuffledUsers.value.filter(u => u.userId !== userStore.user.userId);
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
        emit('nextStep');
      },
      disabled: false,
    };
  });

  watch(
    game,
    (game: Game | null) => {
      if (game && game.readyUsersCount == game.usersCount) {
        currentStep.value = 1;

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
        :label="currentStep ? `${$t('correctAnswer')}` : ''"
        :imgSource="getAvatar(activeUser.avatar.id)"
        isSelected
        isSelectedBold
        @click="selectAnswer(activeUser.userId)"
      />
      <UserListElement
        v-for="user in userList"
        :key="user.userId"
        :text="user.answer?.answer ?? ''"
        :avatarLabel="currentStep ? user.username : ''"
        :label="getLabel(user)"
        :isSelected="isSelected(user.userId)"
        :imgSource="currentStep ? getAvatar(user.avatar.id) : getUnknownAvatar()"
        isSelectedBold
        @click="selectAnswer(user.userId)"
      />
    </div>
    <div v-if="!currentStep" class="acceptPanel">
      <!-- <LevelBar
        v-if="!isUserReady"
        :points="timer - 9"
        :requiredPointsToNextLevel="timer"
        :showPointInfo="false"
      /> TODO: dodac timer -->
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
