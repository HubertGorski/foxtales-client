<script setup lang="ts">
import type { PropType } from "vue";
import { User } from "@/models/User";
import { useUserStore } from "@/stores/userStore";
import BrownCard from "../BrownCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
});

const currentUser =
  props.users.find((user) => user.userId === useUserStore().user.userId) ??
  new User();

const votesReceived = [...currentUser.votesReceived]
  .sort((a, b) => b.voteCount - a.voteCount)
  .map(
    (vote) =>
      `${props.users.find((u) => u.userId === vote.voterId)?.username} (${vote.voteCount})`
  )
  .join(", ");

const votesGiven = [...currentUser.votesGiven]
  .sort((a, b) => b.voteCount - a.voteCount)
  .map(
    (vote) =>
      `${props.users.find((u) => u.userId === vote.voterId)?.username} (${vote.voteCount})`
  )
  .join(", ");

const totalVotesReceived = currentUser.votesReceived.reduce(
  (s, v) => s + v.voteCount,
  0
);

const cards = [
  { header: t("Poziom 1"), content: "15 / 64 exp" },
  { header: t("psych.summary.playersYouPlayTheMost"), content: votesReceived },
  { header: t("psych.summary.playersWhoAmuseYouTheMost"), content: votesGiven },
  { header: t("Odblokowano liska Happy") },
  { header: t("Zdobyto 82 monety") },
  { header: t("psych.summary.youFoundOutAboutYourselfThings", { x: 12 }) },
  {
    header: t("psych.summary.yourAnswersWereChosenXTimes", {
      x: totalVotesReceived,
    }),
  },
  {
    header: t(
      "psych.summary.inGameYourOwnAnswerWasExperiencedTimesIncludingYouTimes",
      { x: 4, x2: 2 }
    ),
  },
];
</script>

<template>
  <transition-group name="slide-left" tag="div" class="summaryGame">
    <BrownCard
      v-for="(card, i) in cards"
      :key="i"
      :header="card.header"
      :isDividerVisible="!!card.content"
      class="card"
      :style="{ animationDelay: `${i * 0.2}s` }"
    >
      <template v-if="card.content">
        <div>{{ card.content }}</div>
      </template>
    </BrownCard>
  </transition-group>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.summaryGame {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;
  overflow-y: scroll;
  
  .card {
    width: 100%;
    opacity: 0;
    transform: translateX(-50px);
    animation: slideIn 0.6s ease forwards;
  }
}
</style>
