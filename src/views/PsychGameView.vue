<script setup lang="ts">
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useRouter } from 'vue-router';
  import StepQuestion from '@/components/psychGame/StepQuestion.vue';
  import StepResults from '@/components/psychGame/StepResults.vue';
  import StepVoting from '@/components/psychGame/StepVoting.vue';
  import { computed, toRef, watch } from 'vue';
  import { Game } from '@/models/Game';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { NO_ACCESS_REASON } from '@/enums/noAccessReasonEnum';
  import { useUserStore } from '@/stores/userStore';
  import StepEnd from '@/components/psychGame/StepEnd.vue';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import { VIEW } from '@/enums/viewsEnum';
  import NoAccessView from './NoAccessView.vue';

  const router = useRouter();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const currentUserId = computed(() => userStore.user.userId);
  const currentUser =
    computed(() => game.value.users.find(user => user.userId === currentUserId.value)) ?? null;

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const getCurrentStep = computed(() => {
    switch (currentUser.value?.currentView) {
      case VIEW.ADD_ANSWER:
        return StepQuestion;
      case VIEW.ADD_ANSWER_WAITING_FOR_USERS:
        return StepQuestion;
      case VIEW.SELECT_ANSWER:
        return StepVoting;
      case VIEW.SELECT_ANSWER_WAITING_FOR_USERS:
        return StepVoting;
      case VIEW.SHOW_OWNERS:
        return StepVoting;
      case VIEW.SHOW_RESULTS:
        return StepResults;
      default:
        return NoAccessView;
    }
  });

  const leaveRoom = async () => {
    const success = await signalRStore.leaveRoom(userStore.user.userId);
    if (!success) {
      return;
    }

    router.push(ROUTE_PATH.MENU);
  };

  // TODO: zrobic konczenie gry
  const finishGame = async () => {
    game.value.hasGameEnded = true;
  };

  if (game == null || !game.value.code) {
    router.push(ROUTE_PATH.MENU);
  }

  const finishGameBtn = computed(() => {
    return {
      text: userStore.user.userId === game.value.owner.userId ? 'finishGame' : 'leaveGame',
      action: userStore.user.userId === game.value.owner.userId ? finishGame : leaveRoom,
    };
  });

  watch(
    game,
    async (game: Game | null) => {
      if (game == null || game.code == null) {
        router.push({
          path: ROUTE_PATH.NO_ACCESS,
          query: { reason: NO_ACCESS_REASON.GAME_CLOSED },
        });
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="psychGameView">
    <div v-if="!game.hasGameEnded" class="psychGameView_header">
      <HubBtn :action="finishGameBtn.action" :text="finishGameBtn.text" />
      <span class="roundInfo">{{ $t('round') }} {{ game.round }}</span>
    </div>
    <StepEnd v-if="game.hasGameEnded" @leaveRoom="leaveRoom" />
    <component :is="getCurrentStep" v-else :key="currentUser?.currentView ?? 0" />
  </div>
</template>

<style lang="scss">
  @import '@/assets/styles/variables';
  @import '@/assets/styles/hubAnimations';

  .psychGameView {
    background: $mainBackground;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &_header {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 4px 12px;

      .hubBtn {
        font-size: 16px;
        padding: 4px;
      }

      .roundInfo {
        white-space: nowrap;
        font-size: 20px;
        color: $mainBrownColor;
        padding: 8px;
        font-weight: 600;
      }
    }
  }
</style>
