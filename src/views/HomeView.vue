<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const { t } = useI18n();

const btns = [
  {
    id: 1,
    text: t("login"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOGIN)
  },
  {
    id: 2,
    text: t("register"),
    isOrange: true,
    action: () => router.push(ROUTE_PATH.REGISTER)
  },
]
</script>

<template>
  <div class="homeView">
    <img src="@/assets/imgs/fox1.webp" alt="Lisek" class="homeView_img" />
    <HubBtn :action="btns[0].action" :text="btns[0].text" :isOrange="btns[0].isOrange"/>
    <HubBtn :action="btns[1].action" :text="btns[1].text" :isOrange="btns[1].isOrange"/>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.homeView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  gap: 20px;
  background: $mainBackground;
  
    &_img {
      max-width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
}

</style>
