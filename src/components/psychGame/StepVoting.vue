<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue';
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
  const shuffledUsers = ref<User[]>(shuffleArray(game.value.users));

  const isQuietDaysMode = computed(() => game.value.currentRules === RULES.QUIET_DAYS);
  const isSubjectPlayer = computed(
    () => userStore.user.userId === game.value.currentQuestion?.currentUser?.userId
  );

  const activeUser = computed(
    () => game.value.users.find(u => u.userId === userStore.user.userId)!
  );

  const confirmSelectedAnswer = () => {
    if (!selectedAnswerUserIds.value.length && !isQuietDaysMode.value) {
      return;
    }

    signalRStore.chooseAnswer(userStore.user.userId, selectedAnswerUserIds.value);
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

  const chooseAnswerText = computed(() => {
    if (currentStep.value === 0) {
      return isUserReady.value ? t('waitForVotes') : t('chooseAnswer');
    }

    return t('voteResults');
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
        isQuietDaysMode.value && !isSubjectPlayer.value
          ? 'next'
          : isUserReady.value
            ? 'accepted'
            : 'accept',
      isOrange: true,
      action: confirmSelectedAnswer,
      disabled: !selectedAnswerUserIds.value || isUserReady.value,
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
        :label="currentStep ? `${$t('votersCount')} ${activeUser.answer?.votersCount}` : ''"
        :imgSource="getAvatar(activeUser.avatar.id)"
        isSelected
        @click="selectAnswer(activeUser.userId)"
      />
      <UserListElement
        v-for="user in userList"
        :key="user.userId"
        :text="user.answer?.answer ?? ''"
        :avatarLabel="currentStep ? user.username : ''"
        :label="currentStep ? `${$t('votersCount')} ${user.answer?.votersCount}` : ''"
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
        :tooltipText="
          isQuietDaysMode && !isSubjectPlayer
            ? $t('waitingQuietMode')
            : isUserReady
              ? $t('isAnswerPicked')
              : $t('selectFavAnswer')
        "
        :tooltipDisabled="!confirmBtn.disabled"
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
