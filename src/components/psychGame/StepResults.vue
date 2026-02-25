<script setup lang="ts">
  import { Game } from '@/models/Game';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useUserStore } from '@/stores/userStore';
  import { computed, onBeforeMount, reactive, toRef, watch } from 'vue';
  import HubDivider from '../hubComponents/HubDivider.vue';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import UserListElement from '../UserListElement.vue';
  import { getAvatar } from '@/utils/imgUtils';
  import { RULES } from '@/enums/rulesEnum';
  import { VIEW } from '@/enums/viewsEnum';
  import { useI18n } from 'vue-i18n';

  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const { t } = useI18n();

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());
  const isQuietDaysMode = computed(() => game.value.currentRules === RULES.QUIET_DAYS);
  const sortedUsers = computed(() =>
    [...game.value.users].sort((a, b) => b.pointsInGame - a.pointsInGame)
  );

  const currentUserId = computed(() => userStore.user.userId);
  const isReadyForNewRound = computed(
    () =>
      game.value.isUserReady(currentUserId.value, VIEW.ADD_ANSWER) &&
      game.value.isCurrentView(currentUserId.value, VIEW.SHOW_RESULTS)
  );

  const votersForHisAnswerString = computed<string>(() => {
    const currentUser = game.value.users.find(user => user.userId === currentUserId.value);
    const votersIds = currentUser?.votersIdsForHisAnswer;

    if (!votersIds?.length) return '';

    const userMap = new Map(game.value.users.map(user => [user.userId, user]));

    return votersIds
      .map(id => (id === currentUserId.value ? t('you') : userMap.get(id)?.username))
      .filter(Boolean)
      .join(', ');
  });

  const everyoneChoseYourAnswer = computed(() => {
    const currentUser = game.value.users.find(user => user.userId === currentUserId.value);
    const votersIds = currentUser?.votersIdsForHisAnswer ?? [];

    const otherPlayersCount = game.value.users.length - 1;
    const votersWithoutSelf = votersIds.filter(id => id !== currentUserId.value);

    return otherPlayersCount > 0 && votersWithoutSelf.length === otherPlayersCount;
  });

  const votersTitle = computed(() => {
    if (everyoneChoseYourAnswer.value) return t('everyoneChoseYourAnswer');
    if (votersForHisAnswerString.value) return t('yourAnswerWasChosen');
    return t('nobodyChoseYourAnswer');
  });

  const nextPageBtn = computed(() => {
    return {
      text: isReadyForNewRound.value ? 'lobby.waitingForPlayers' : 'ready',
      isOrange: true,
      action: startNextRound,
      disabled: isReadyForNewRound.value,
    };
  });

  onBeforeMount(() => {
    if (!signalRStore.userIdsOrderList.length) {
      return;
    }

    signalRStore.userIdsOrderList = [];
  });

  const startNextRound = async () => {
    await signalRStore.SetReadyForNewRound(userStore.user.userId);
  };

  const isUserReadyForNewRound = (userId: number): boolean => {
    return (
      game.value.isUserReady(userId, VIEW.ADD_ANSWER) &&
      game.value.isCurrentView(userId, VIEW.SHOW_RESULTS)
    );
  };

  const displayedPoints = reactive<Record<number, number>>({});
  const animatedUserIds = new Set<number>();

  const animatePoints = (userId: number, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(start + (end - start) * progress);
      displayedPoints[userId] = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  };

  watch(
    () => game.value.users,
    users => {
      users.forEach(user => {
        if (!animatedUserIds.has(user.userId)) {
          const startVal = user.pointsInGame - user.newPoints;
          displayedPoints[user.userId] = startVal;
          animatedUserIds.add(user.userId);

          setTimeout(() => {
            animatePoints(user.userId, startVal, user.pointsInGame, 1000);
          }, 1500);
        }
      });
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div class="stepResults">
    <HubDivider :text="$t('summary')" />
    <div class="content">
      <div class="summary">
        <UserListElement
          v-for="user in sortedUsers"
          :key="user.userId"
          :imgSource="getAvatar(user.avatar.id)"
          :text="user.username"
          :sublabel="user.newPoints ? `+${user.newPoints}` : ''"
          :label="`${displayedPoints[user.userId] ?? user.pointsInGame} ${$t('points')}`"
          :isSelected="isUserReadyForNewRound(user.userId)"
          :teamId="user.teamId"
        />
      </div>
      <div v-if="!isQuietDaysMode" class="votersForHisAnswer">
        <img src="@/assets/imgs/fox13.webp" alt="Lisek" />
        <div class="whiteCard voters">
          <div class="title">{{ votersTitle }}</div>
          <div v-if="votersForHisAnswerString" class="yourAnswerWasChosen">
            {{ votersForHisAnswerString }}
          </div>
        </div>
        <HubDivider />
      </div>
    </div>
    <div class="nextPageBtn">
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
  @use '@/assets/styles/variables' as *;

  .stepResults {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 12px;
    padding-top: 0;

    .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .votersForHisAnswer {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        padding: 0 8px;

        .voters {
          margin: 8px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: 84px;
          overflow-y: auto;
          padding: 6px;

          .title {
            text-align: center;
            font-size: 14px;
            font-style: italic;
            color: $lightGrayColor;
            letter-spacing: 0.5px;
          }

          .yourAnswerWasChosen {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $grayColor;
            text-align: center;
          }
        }

        .hubDivider {
          grid-column: 1 / -1;
        }

        img {
          max-height: 100px;
        }
      }

      .summary {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    .nextPageBtn {
      width: 100%;

      .hubBtn {
        padding: 8px;
        margin: 0 auto;
      }
    }
  }
</style>
