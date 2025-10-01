<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
</script>

<template>
  <div class="welcomeView">
    <span class="text">{{ $t("accountWasSetUp") }}</span>
    <transition name="bigger" appear>
      <span class="title">{{ $t("foxTales") }}</span>
    </transition>
    <img src="@/assets/imgs/welcome.webp" alt="Lisek" />
    <NavigationBtns btn="goToLogin" />
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";
@import "@/assets/styles/hubAnimations";

.welcomeView {
  background: $mainBackground;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    max-width: 96%;
  }

  .text {
    font-size: 28px;
    text-align: center;
    font-weight: 600;
    color: $mainBrownColor;
  }

  .title {
    padding-bottom: 12px;
    font-size: 64px;
    font-weight: 600;
    color: $mainOrangeColor;
    text-shadow:
      2px 2px 0px #ffdb58,
      4px 4px 0px $mainBrownColor;
    line-height: 1;
  }

  .hubBtn.navigationBtns_btn {
    max-width: 100% !important;
    padding: 8px 16px;
    font-size: 16px;
  }
}
</style>
