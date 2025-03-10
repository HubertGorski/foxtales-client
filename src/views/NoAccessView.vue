<script setup lang="ts">
import NavigationBtns from "@/components/NavigationBtns.vue";
</script>

<template>
  <div class="noAccessView">
    <div class="noAccessView_content">
      <img src="@/assets/imgs/fox6.png" alt="Lisek" />
      <p class="">{{ $t("requiredAdminRole") }}</p>
    </div>
    <NavigationBtns btn="back2" btn2="logout" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.noAccessView {
  background: $mainBackground;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &_content {
    font-size: 16px;
    font-weight: 600;
    color: $grayColor;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-grow: 1;
  }

  p {
    text-align: center;
    background-color: rgba(240, 248, 255, 0.3);
    border-radius: 8px;
  }
}
</style>
