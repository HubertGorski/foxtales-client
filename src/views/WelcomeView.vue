<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useViewStore } from '@/stores/viewStore';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';

  const router = useRouter();

  const handleLogin = () => {
    const { redirectPath, setRedirectPath } = useViewStore();
    router.push(redirectPath || ROUTE_PATH.MENU);
    setRedirectPath(null);
  };
</script>

<template>
  <div class="welcomeView">
    <span class="text">{{ $t('accountWasSetUp') }}</span>
    <transition name="bigger" appear>
      <span class="title">{{ $t('foxTales') }}</span>
    </transition>
    <img src="@/assets/imgs/welcome.webp" alt="Lisek" />
    <HubBtn :action="handleLogin" text="goToLogin" isOrange />
  </div>
</template>

<style lang="scss">
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/hubAnimations' as *;

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
        2px 2px 0 #ffdb58,
        4px 4px 0 $mainBrownColor;
      line-height: 1;
    }

    .hubBtn {
      max-width: 100% !important;
      padding: 8px 16px;
      font-size: 16px;
    }
  }
</style>
