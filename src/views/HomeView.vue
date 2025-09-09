<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";

const router = useRouter();

const goToLogin = () => {
  router.push(ROUTE_PATH.LOGIN);
};

const goToRegister = () => {
  router.push(ROUTE_PATH.REGISTER);
};
const btns = [
  {
    id: 1,
    text: "login",
    isOrange: false,
    action: goToLogin,
  },
  {
    id: 2,
    text: "register",
    isOrange: true,
    action: goToRegister,
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
        :action="btns[0].action"
        :text="btns[0].text"
        :isOrange="btns[0].isOrange"
      />
      <HubBtn
        :action="btns[1].action"
        :text="btns[1].text"
        :isOrange="btns[1].isOrange"
      />
    </div>
    <img src="@/assets/imgs/foxes.webp" alt="Lisek" class="homeView_img" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.homeView {
  height: 100vh;
  background: $mainBackground;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
    width: 100%;
  }

  &_img {
    width: 100%;
  }
}
</style>
