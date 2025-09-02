<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useFullscreen } from "@/useFullscreen";

const { enter } = useFullscreen();

const router = useRouter();

const goToLogin = () => {
  enter();
  router.push(ROUTE_PATH.LOGIN);
};

const goToRegister = () => {
  enter();
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
    <p class="homeView_title">FOX TALES</p>
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
    <img src="@/assets/imgs/foxes.png" alt="Lisek" class="homeView_img" />
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
    font-size: 42px;
    font-weight: 800;
    font-family: "Poppins", sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(45deg, #ff8c00, #ffca28);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    padding-top: 32px;
    text-align: center;
  }
  &_btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding-top: 64px;
  }

  &_img {
    width: 100%;
  }
}
</style>
