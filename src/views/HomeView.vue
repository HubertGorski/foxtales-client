<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { ICON } from "@/enums/iconsEnum";
import { isFullscreen, toggleFullscreen } from "@/libs/fullscreenToggle";
import { ref } from "vue";

const router = useRouter();

const isFullscreenState = ref(isFullscreen());

const handleFullscreen = () => {
  toggleFullscreen();
  isFullscreenState.value = !isFullscreenState.value;
};

const btns = [
  {
    id: 1,
    text: "login",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOGIN),
  },
  {
    id: 2,
    text: "tryWithoutAccount",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.TRY_WITHOUT_ACCOUNT),
  },
  {
    id: 3,
    text: "register",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.REGISTER),
  },
];
</script>

<template>
  <div class="homeView">
    <div>
      <p class="homeView_title">FOX TALES</p>
      <p class="homeView_subtitle">Be as sly as a fox!</p>
    </div>
    <div class="homeView_btns">
      <HubBtn
        v-for="btn in btns"
        :key="btn.id"
        :action="btn.action"
        :text="btn.text"
        :isOrange="btn.isOrange"
      />
    </div>
    <div>
      <div
        class="homeIcon"
        @click="handleFullscreen"
        :class="{ isActive: isFullscreenState }"
      >
        <transition name="fade2" mode="out-in">
          <v-icon :key="isFullscreenState ? 1 : 0">
            {{ isFullscreenState ? ICON.FULLSCREEN_OFF : ICON.FULLSCREEN_ON }}
          </v-icon>
        </transition>
      </div>
    </div>
    <img src="@/assets/imgs/foxes.webp" alt="Lisek" class="homeView_img" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
@import "@/assets/styles/hubAnimations";

.homeView {
  height: 100%;
  background: $mainBackground;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;

  &_title {
    font-size: 64px;
    font-weight: 600;
    color: $mainOrangeColor;
    text-shadow:
      2px 2px 0px #ffdb58,
      4px 4px 0px $mainBrownColor;
    text-align: center;
    padding-top: 32px;
    line-height: 1;
  }

  &_subtitle {
    text-align: end;
    padding: 0 12px;
    color: $mainBrownColor;
    font-size: 24px;
    font-weight: 600;
    font-family: "Story Script", sans-serif;
    letter-spacing: 1px;
  }

  &_btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 12px 32px;
  }

  &_img {
    width: 100%;
  }

  .homeIcon {
    position: absolute;
    bottom: 12px;
    right: 12px;
    cursor: pointer;
    background-color: $mainOrangeColor;
    color: $whiteColor;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 4px 8px rgba(252, 152, 40, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1);

    border: 1px solid rgba(84, 50, 47, 0.15);
    transition: all 0.2s;

    .v-icon {
      padding: 10px;
      font-size: 48px;
    }

    &.isActive {
      background-color: $darkOrangeColor;
      transition: all 0.2s;
    }
  }
}
</style>
