<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";
import HubInputWithBtn from "../hubComponents/HubInputWithBtn.vue";
import HubImageWithText from "../hubComponents/HubImageWithText.vue";
import { useI18n } from "vue-i18n";
import WhiteCard from "../WhiteCard.vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { DEFAULT_FOX_NAME } from "@/enums/userEnum";
import { useSignalRStore } from "@/stores/signalRStore";
import { useUserStore } from "@/stores/userStore";
import { Answer } from "@/models/Answer";

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

const getAvatar = (id: number | undefined): string => {
  if (!id) {
    return "";
  }

  return new URL(
    `/src/assets/imgs/defaultAvatars/${id}.webp`,
    import.meta.url
  ).href;
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

const fox = computed(() => {
  return new URL(
    `/src/assets/imgs/${game.value.currentQuestion?.currentUser?.avatar.id}.webp`,
    import.meta.url
  ).href;
});

watch(game, (game: Game | null) => {
  if (game?.readyUsersCount == game?.usersCount) {
    emit("nextStep");
  }
});
</script>

<template>
  <div class="stepQuestion" :class="{ isHovered: !isFoxVisible }">
    <HubDivider :text="dividerText" />
    <div class="stepQuestion_gameSection">
      <transition name="fade" mode="out-in" appear>
        <div v-if="!isUserReady" key="stepAnswer" class="stepAnswer">
          <img :src="fox" alt="Lisek" class="fox" />
          <img
            :src="getAvatar(game.currentQuestion?.currentUser?.avatar.id)"
            alt="Lisek"
            class="foxAvatar"
          />
          <WhiteCard
            :header="
              game.currentQuestion?.currentUser?.username ?? DEFAULT_FOX_NAME
            "
          >
            <div class="question">
              {{ game.currentQuestion?.text }}
            </div>
          </WhiteCard>
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
            imageSrc="src/assets/imgs/fox3.webp"
            alt="Lisek"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
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

    .whiteCard {
      width: 100%;
    }

    .stepAnswer {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .foxAvatar {
        transform: scale(0);
        border: 2px solid $mainBrownColor;
        background-color: white;
        height: 52px;
        width: 52px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 50%;
        padding: 2px;
        position: absolute;
        left: -12px;
        top: -12px;
        z-index: 2;
      }

      .question {
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        letter-spacing: 0.5px;
      }

      .input {
        width: 100%;
      }

      .fox {
        height: 200px;
        transition: all 0.2s;
      }
    }

    .stepWaiting img {
      max-width: 100%;
    }
  }

  &.isHovered {
    .fox {
      height: 0;
    }

    .foxAvatar {
      transform: scale(1);
      transition: all 0.4s ease-out;
    }

    .header {
      margin-left: 34px;
      transition: all 0.4s;
    }

    .stepQuestion_gameSection {
      justify-content: start;
    }
  }
}
</style>
