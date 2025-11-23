<script setup lang="ts">
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { useRouter } from 'vue-router';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import { ICON } from '@/enums/iconsEnum';
  import { toggleFullscreen } from '@/libs/fullscreenToggle';
  import OrangeSwitchBtn from '@/components/OrangeSwitchBtn.vue';
  import { useI18n } from 'vue-i18n';
  import { LANG } from '@/enums/languagesEnum';

  const router = useRouter();
  const { locale } = useI18n();

  const changeLanguage = () => {
    locale.value = locale.value === LANG.EN ? LANG.PL : LANG.EN;
  };

  const handleFullscreen = () => {
    toggleFullscreen();
  };

  const btns = [
    {
      id: 1,
      text: 'login',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.LOGIN),
    },
    {
      id: 2,
      text: 'tryWithoutAccount',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.TRY_WITHOUT_ACCOUNT),
    },
    {
      id: 3,
      text: 'register',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.REGISTER),
    },
  ];
</script>

<template>
  <div class="homeView">
    <div>
      <p class="homeView_title">FOX TALES</p>
      <p class="homeView_subtitle">Be as sly as a fox</p>
    </div>
    <div class="homeView_btns">
      <HubBtn
        v-for="btn in btns"
        :key="btn.id"
        :action="btn.action"
        :text="btn.text"
        :isOrange="btn.isOrange"
      />
    </div>
    <div class="homeView_settingsBtns">
      <OrangeSwitchBtn
        :action="changeLanguage"
        :iconOff="ICON.LANGUAGE"
        :iconOn="ICON.LANGUAGE"
        iconSize="34"
      />
      <OrangeSwitchBtn
        :action="handleFullscreen"
        :iconOff="ICON.FULLSCREEN_OFF"
        :iconOn="ICON.FULLSCREEN_ON"
      />
    </div>
    <img src="@/assets/imgs/foxes.webp" alt="Lisek" class="homeView_img" />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .homeView {
    height: 100%;
    background: $mainBackground;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;

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
      font-family: 'Story Script', sans-serif;
      letter-spacing: 1px;
    }

    &_btns {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 12px 32px;
    }

    &_img {
      width: 100%;
    }

    &_settingsBtns {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
