<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";
import HubInputWithBtn from "../hubComponents/HubInputWithBtn.vue";
import HubImageWithText from "../hubComponents/HubImageWithText.vue";
import { useI18n } from "vue-i18n";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";
import { useUserStore } from "@/stores/userStore";
import { Answer } from "@/models/Answer";
import CurrentQuestion from "../CurrentQuestion.vue";

const { t } = useI18n();
const signalRStore = useSignalRStore();
const userStore = useUserStore();

const emit = defineEmits<{
  (e: "nextStep"): void;
}>();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);

const answerText = ref<string>("");
const isUserReady = ref<boolean>(false);
const isFoxVisible = ref<boolean>(true);

const addAnswer = async () => {
  event?.preventDefault();
  const answer = new Answer(
    0,
    game.value.currentQuestion?.id ?? 0,
    userStore.user.userId,
    answerText.value
  );
  await signalRStore.addAnswer(answer);
  isUserReady.value = true;
};

const focusHandler = () => {
  isFoxVisible.value = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const addAnswerBtn = computed(() => ({
  text: "add",
  isOrange: true,
  action: addAnswer,
}));

const waitingInfo = computed(
  () =>
    `${t("lobby.waitingForPlayers")} ( ${game.value.readyUsersCount} / ${game.value.usersCount} )`
);
const dividerText = computed(() =>
  isUserReady.value ? t("waitForAnswers") : t("writeAnswer")
);

watch(game, (game: Game | null) => {
  if (game?.readyUsersCount == game?.usersCount) {
    emit("nextStep");
  }
});
</script>

<template>
  <div class="stepQuestion">
    <HubDivider :text="dividerText" />
    <div class="stepQuestion_gameSection" :class="{ isHovered: !isFoxVisible }">
      <transition name="fade" mode="out-in" appear>
        <div v-if="!isUserReady" key="stepAnswer">
          <CurrentQuestion
            :isFoxVisible="isFoxVisible"
            :question="game.currentQuestion?.text ?? ''"
            :avatarId="game.currentQuestion?.currentUser?.avatar.id ?? 0"
            :username="game.currentQuestion?.currentUser?.username ?? ''"
          />
          <HubInputWithBtn
            v-model="answerText"
            class="whiteCard input"
            :btnAction="addAnswerBtn.action"
            :btnText="addAnswerBtn.text"
            :btnIsOrange="addAnswerBtn.isOrange"
            :textareaRows="5"
            isTextarea
            @focus="focusHandler"
          />
        </div>
        <div v-else key="stepWaiting" class="stepWaiting">
          <HubImageWithText
            :text="waitingInfo"
            imageSrc="/imgs/fox3.webp"
            alt="Lisek"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
@import "@/assets/styles/hubAnimations";

.stepQuestion {
  display: flex;
  flex-direction: column;
  height: 100%;

  &_gameSection {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;

    &.isHovered {
      justify-content: start;
    }

    .stepWaiting img {
      max-width: 100%;
    }
  }
}
</style>
