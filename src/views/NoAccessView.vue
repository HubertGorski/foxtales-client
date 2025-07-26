<script setup lang="ts">
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
      return t("auth.tryLoginAgain")
  }
});
</script>

<template>
  <div class="noAccessView">
    <div class="noAccessView_content">
      <img src="@/assets/imgs/fox6.png" alt="Lisek" />
      <p class="info">
        {{ alert }}
      </p>
    </div>
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

    .info {
      text-align: center;
      background-color: $infoBackgroundColor;
      border-radius: 8px;
      padding: 12px 8px;
    }
  }

  .hubBtn.navigationBtns_btn {
    max-width: 100% !important;
    font-size: 16px;
  }
}
</style>
