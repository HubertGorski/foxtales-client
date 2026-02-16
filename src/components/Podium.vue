<script setup lang="ts">
  import type { User } from '@/models/User';
  import FoxWithName from './FoxWithName.vue';

  const { users } = defineProps<{
    users: User[];
  }>();

  const getAvatar = (id: number) => `/src/assets/imgs/${id}.webp`;

  const podiumPositions = [
    {
      winnerClass: 'podium_winner--first',
      pointsClass: 'podium_points--first',
    },
    {
      winnerClass: 'podium_winner--second',
      pointsClass: 'podium_points--second',
    },
    {
      winnerClass: 'podium_winner--third',
      pointsClass: 'podium_points--third',
    },
  ];
</script>

<template>
  <div class="podium">
    <img class="podium_img" src="@/assets/imgs/psych/winners.png" alt="winners" />
    <template v-for="(user, index) in users.slice(0, 3)" :key="user.userId">
      <div class="podium_winner" :class="podiumPositions[index].winnerClass">
        <FoxWithName :text="user.username" :src="getAvatar(user.avatar.id)" />
      </div>
      <div class="podium_points" :class="podiumPositions[index].pointsClass">
        {{ user.pointsInGame }} {{ $t('exp') }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .podium {
    position: relative;
    margin-bottom: 32px;
    display: flex;
    justify-content: center;

    &_img {
      max-width: 340px;
      padding-top: 148px;
    }

    &_winner {
      position: absolute;
      display: flex;
      flex-direction: column;
      width: 100%;

      &--first {
        align-items: center;
        bottom: 106px;
      }

      &--second {
        align-items: start;
        bottom: 70px;
      }

      &--third {
        align-items: end;
        bottom: 52px;
      }
    }

    &_points {
      position: absolute;
      bottom: -20px;
      background-color: $whiteColor;
      border-radius: 8px;
      text-align: center;
      width: 110px;
      border: 1px solid $mainBrownColor;
      color: $mainBrownColor;
      font-weight: 600;

      &--first {
        margin: 0 auto;
      }

      &--second {
        left: 0;
      }

      &--third {
        right: 0;
      }
    }
  }
</style>
