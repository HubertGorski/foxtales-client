<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const btn = {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU)
  };
</script>

<template>
  <div class="settingsView">
    <img src="@/assets/imgs/fox3.png" alt="Lisek" class="fox" />
    <div class="txt">
      <p>{{ $t("pageNotExist") }}</p>
    </div>
    <HubBtn class="btn" :action="btn.action" :text="btn.text" :isOrange="btn.isOrange"/>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
.settingsView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

    .txt {
      font-size: 24px;
      font-weight: 600;
      color: $grayColor;
      padding: 24px;
    }

    .btn {
      max-width: 196px;
      padding: 12px 20px;
    }
}
</style>
