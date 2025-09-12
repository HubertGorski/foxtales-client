<script setup lang="ts">
import { computed } from "vue";
import { getAvatar } from "@/utils/imgUtils";
import WhiteCard from "./WhiteCard.vue";

const props = defineProps({
  question: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatarId: {
    type: Number,
    required: true,
  },
  isFoxVisible: {
    type: Boolean,
    required: true,
  },
});

const fox = computed(() => {
  return new URL(`/src/assets/imgs/${props.avatarId}.webp`, import.meta.url)
    .href;
});
</script>

<template>
  <div class="currentQuestion" :class="{ isFoxVisible: !isFoxVisible }">
    <img :src="fox" alt="Lisek" class="fox" />
    <img :src="getAvatar(avatarId)" alt="Lisek" class="foxAvatar" />
    <WhiteCard :header="username">
      <div class="question">
        {{ question }}
      </div>
    </WhiteCard>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";
.currentQuestion {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .whiteCard {
    width: 100%;
  }

  .fox {
    height: 200px;
    transition: all 0.4s ease;
  }

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

  &.isFoxVisible {
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
  }
}
</style>
