<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue';
  import HubInputWithBtn from '../hubComponents/HubInputWithBtn.vue';
  import HubImageWithText from '../hubComponents/HubImageWithText.vue';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import { useI18n } from 'vue-i18n';
  import HubDivider from '../hubComponents/HubDivider.vue';
  import { Game } from '@/models/Game';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useUserStore } from '@/stores/userStore';
  import { Answer } from '@/models/Answer';
  import CurrentQuestion from '../CurrentQuestion.vue';
  import { ICON } from '@/enums/iconsEnum';
  import { VIEW } from '@/enums/viewsEnum';

  const { t } = useI18n();
  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const game = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const answerText = ref<string>('');
  const isFoxVisible = ref<boolean>(true);
  const skipTimeLeft = ref<number>(0);

  const skipRound = async () => {
    event?.preventDefault();
    await signalRStore.skipRound();
  };

  const addAnswer = async () => {
    isFoxVisible.value = true;
    event?.preventDefault();
    const answer = new Answer(
      0,
      game.value.currentQuestion?.id ?? 0,
      currentUserId.value,
      answerText.value
    );

    await signalRStore.addAnswer(answer);
  };

  const currentUserId = computed(() => userStore.user.userId);
  const isOwner = computed(() => game.value.owner.userId === currentUserId.value);
  const isReady = computed(() =>
    game.value.isCurrentView(currentUserId.value, VIEW.ADD_ANSWER_WAITING_FOR_USERS)
  );

  const addAnswerBtn = computed(() => ({
    text: skipTimeLeft.value
      ? t('questionHasBeenChanged', { skipTimeLeft: skipTimeLeft.value })
      : 'add',
    isOrange: true,
    isDisabled: skipTimeLeft.value > 0 || isReady.value,
    action: addAnswer,
  }));

  const skipBtn = computed(() => {
    return {
      text: skipTimeLeft.value ? t('skipTimeLeft', { skipTimeLeft: skipTimeLeft.value }) : 'skip',
      isOrange: false,
      action: skipRound,
      disabled: game.value.getReadyUsersCount(VIEW.SELECT_ANSWER) > 0 || skipTimeLeft.value > 0,
      isVisible: isOwner.value,
    };
  });

  const waitingInfo = computed(
    () =>
      `${t('lobby.waitingForPlayers')} ( ${game.value.getReadyUsersCount(VIEW.SELECT_ANSWER)} / ${game.value.usersCount} )`
  );
  const dividerText = computed(() => (isReady.value ? t('waitForAnswers') : t('writeAnswer')));
  const questionText = computed((): string => {
    if (game.value.currentQuestion?.textInOtherLanguage) {
      return (
        game.value.currentQuestion.textInOtherLanguage[userStore.user.language] ??
        game.value.currentQuestion.text
      );
    }

    return game.value.currentQuestion?.text ?? '';
  });

  watch(
    () => game.value?.currentQuestion,
    (newQuestion, oldQuestion) => {
      if (newQuestion?.id === oldQuestion?.id) {
        return;
      }

      skipTimeLeft.value = 5;
      const timer = setInterval(() => {
        skipTimeLeft.value--;
        if (skipTimeLeft.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  );
</script>

<template>
  <div class="stepQuestion">
    <HubDivider :text="dividerText" />
    <div class="stepQuestion_gameSection">
      <transition name="fade" mode="out-in" appear>
        <div v-if="!isReady" key="stepAnswer">
          <div class="question" :class="{ 'pb-4': isOwner }">
            <CurrentQuestion
              :isFoxVisible="isFoxVisible"
              :question="questionText"
              :avatarId="game.currentQuestion?.currentUser?.avatar.id ?? 0"
              :username="game.currentQuestion?.currentUser?.username ?? ''"
            />
            <HubBtn
              v-if="skipBtn.isVisible"
              :action="skipBtn.action"
              :text="skipBtn.text"
              :disabled="skipBtn.disabled"
              :isOrange="skipBtn.isOrange"
              :icon="ICON.MINI_ARROW_RIGHT"
            />
          </div>
          <HubInputWithBtn
            v-model="answerText"
            class="whiteCard input"
            :btnAction="addAnswerBtn.action"
            :btnText="addAnswerBtn.text"
            :btnIsOrange="addAnswerBtn.isOrange"
            :btnIsDisabled="addAnswerBtn.isDisabled"
            :textareaRows="5"
            isTextarea
            @focus="isFoxVisible = false"
            @blur="isFoxVisible = false"
          />
        </div>
        <div v-else key="stepWaiting" class="stepWaiting">
          <HubImageWithText :text="waitingInfo" imageSrc="/imgs/fox3.webp" alt="Lisek" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  @import '@/assets/styles/hubAnimations';

  .stepQuestion {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 12px;

    &_gameSection {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 12px;

      .question {
        display: flex;
        flex-direction: column;
        align-items: end;

        .currentQuestion {
          width: 100%;
        }

        .hubBtn {
          max-width: fit-content;
          padding: 4px 8px;
          font-size: 12px;
          margin: -4px 4px;
        }
      }

      .stepWaiting img {
        max-width: 100%;
      }
    }
  }
</style>
