<script setup lang="ts">
import type { PropType } from "vue";
import { User } from "@/models/User";
import { useUserStore } from "@/stores/userStore";
import BrownCard from "../BrownCard.vue";

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
</script>

<template>
  <div class="summaryGame">
    <div class="summaryGame_title">
      {{ $t("summary") }}
    </div>
    <div class="w-100 h-100 px-1">
      <BrownCard header="Gracze, których najbardziej bawisz:">
        <div class="details">
          {{ votesReceived }}
        </div>
      </BrownCard>
      <BrownCard header="Gracze, którzy najbardziej bawią Ciebie:">
        <div>
          {{ votesGiven }}
        </div>
      </BrownCard>
      <BrownCard header="Dowiedziałeś się o sobie X rzeczy." />
      <BrownCard
        :header="`Wybrano Twoje odpowiedzi ${totalVotesReceived} razy.`"
      />
    </div>
    <img src="@/assets/imgs/fox11.webp" alt="Lisek" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.summaryGame {
  display: flex;
  flex-direction: column;
  align-items: end;
  height: 100%;

  &_title {
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    color: $mainBrownColor;
    margin: 8px 0;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    line-height: 1.3;
    background: linear-gradient(135deg, $mainBrownColor, $lightBrownColor);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  img {
    max-width: 124px;
  }
}
</style>
