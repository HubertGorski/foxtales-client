<script setup lang="ts">
import { DEFAULT_AVATAR } from "@/enums/userEnum";
import { User } from "@/models/User";

const props = defineProps({
  user: {
    type: User,
    required: true,
  },
});

const avatar: string = props.user.avatar || DEFAULT_AVATAR;
</script>

<template>
  <div class="userListElement" @click="user.isReady = !user.isReady">
    <img
      :src="avatar"
      alt="Lisek"
      :class="{ isUserReady: user.isReady }"
      class="userListElement_avatar"
    />
    <div class="userListElement_username">
      {{ user.username }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.userListElement {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 12px;

  &_username {
    font-size: 18px;
    color: $mainBrownColor;
    background-color: $background;
    padding: 12px 32px 12px 64px;
    border-radius: 12px;
    width: 254px;
    z-index: 1;
    text-align: center;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }

  &_avatar {
    background-color: white;
    height: 64px;
    width: 64px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 50%;
    padding: 2px;
    position: absolute;
    left: 8px;
    top: 4px;
    z-index: 2;

    &.isUserReady {
      border: 2px solid $mainBrownColor;
      transform: scale(1.1);
    }
  }
}
</style>
