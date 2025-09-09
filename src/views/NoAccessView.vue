<script setup lang="ts">
import HubImageWithText from "@/components/hubComponents/HubImageWithText.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { NO_ACCESS_REASON } from "@/enums/noAccessReasonEnum";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const reason = useRoute().query.reason;
const { t } = useI18n();

const alert = computed(() => {
  switch (reason) {
    case NO_ACCESS_REASON.ADMIN_ONLY:
      return t("requiredAdminRole");
    case NO_ACCESS_REASON.GAME_CLOSED:
      return t("gameClosed");
    default:
      return t("auth.tryLoginAgain");
  }
});
</script>

<template>
  <div class="noAccessView">
    <HubImageWithText
      :text="alert"
      imageSrc="../assets/imgs/fox6.webp"
      alt="Lisek"
    />
    <NavigationBtns
      v-if="
        reason === NO_ACCESS_REASON.ADMIN_ONLY ||
        reason === NO_ACCESS_REASON.GAME_CLOSED
      "
      btn="back2"
      btn2="logout"
    />
    <NavigationBtns v-else btn="goToLogin" />
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";

.noAccessView {
  background: $mainBackground;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .hubBtn.navigationBtns_btn {
    max-width: 100% !important;
    font-size: 16px;
  }
}
</style>
