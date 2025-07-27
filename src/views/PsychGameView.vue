<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const signalRStore = useSignalRStore();
const userStore = useUserStore();
</script>

<template>
  <div class="psychGameView">
    <h2 class="psychGameView_text">
      {{ $t("pageNotExist") }}
    </h2>
    <img class="psychGameView_img" src="@/assets/imgs/fox11.png" alt="Lisek" />
    <NavigationBtns class="psychGameView_btn" btn="back" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.psychGameView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  &_text {
    font-size: 16px;
    font-weight: 600;
    color: $grayColor;
    background-color: $infoBackgroundColor;
    border-radius: 8px;
    padding: 12px 8px;
    margin-top: 12px;
  }

  &_img {
    position: absolute;
    bottom: 18px;
  }

  &_btn {
    z-index: 1;
  }
}
</style>
