<script setup lang="ts">
import { computed, ref } from "vue";
import HubInputWithBtn from "../hubComponents/HubInputWithBtn.vue";
import HubImageWithText from "../hubComponents/HubImageWithText.vue";
import { useI18n } from "vue-i18n";
import WhiteCard from "../WhiteCard.vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { DEFAULT_FOX_NAME, DEFAULT_FOX_SOURCE } from "@/enums/userEnum";

const { t } = useI18n();

const props = defineProps({
  game: {
    type: Game,
    required: true,
  },
});

const answer = ref<string>("");
const isUserReady = ref<boolean>(false);

const addAnswer = () => {
  event.preventDefault();
  isUserReady.value = true;
};

const addAnswerBtn = computed(() => ({
  text: "add",
  isOrange: true,
  action: addAnswer,
}));

const waitingInfo = computed(
  () =>
    `${t("lobby.waitingForPlayers")} ( ${props.game.readyUsersCount} / ${props.game.usersCount} )`
);
const dividerText = computed(() =>
  isUserReady.value ? t("waitForAnswers") : t("writeAnswer")
);

const currentUser = ref<string>("Adam");
</script>

<template>
  <div class="stepQuestion">
    <HubDivider :text="dividerText" />
    <div class="stepQuestion_gameSection">
      <transition name="fade" mode="out-in" appear>
        <div v-if="!isUserReady" key="stepAnswer" class="stepAnswer">
          <img :src="game.currentQuestion?.currentUser.avatar.source ?? DEFAULT_FOX_SOURCE" alt="Lisek" class="fox" />
          <WhiteCard
            :header="game.currentQuestion?.currentUser.username ?? DEFAULT_FOX_NAME"
          >
            <div class="question">
              {{ game.currentQuestion?.text }}
            </div>
          </WhiteCard>
          <HubInputWithBtn
            v-model="answer"
            class="whiteCard input"
            :btnAction="addAnswerBtn.action"
            :btnText="addAnswerBtn.text"
            :btnIsOrange="addAnswerBtn.isOrange"
            :textareaRows="5"
            isTextarea
          />
        </div>
        <div v-else key="stepWaiting" class="stepWaiting">
          <HubImageWithText
            :text="waitingInfo"
            imageSrc="src/assets/imgs/fox3.png"
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

    .stepAnswer {
      display: flex;
      flex-direction: column;
      align-items: center;

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
        max-height: 200px;
      }
    }

    .stepWaiting img {
      max-width: 100%;
    }
  }
}
</style>
