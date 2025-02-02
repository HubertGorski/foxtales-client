<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const { t } = useI18n();
const router = useRouter();

const selectedTab = ref<number>(0);
const newUsername = ref<string>('');

const changeAvatar = (avatar: Avatar) => {
  userStore.setAvatar(avatar.source);
  avatars.value.map(avatar => avatar.isSelected = false);
  avatar.isSelected = true;
}

const changeUsername = () => {
  userStore.setUsername(newUsername.value);
  newUsername.value = '';
}

const openTab = (tab: number) => {
  selectedTab.value = selectedTab.value === tab ? 0 : tab;
}

const avatars = ref<Avatar[]>([
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: true},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false},
  {source: "/src/assets/imgs/defaultAvatars/defaultAvatar1.png", isSelected: false}
]);

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU)
  },
  {
    id: 2,
    text: "Kup premium",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true
  },
]

const acceptUsernameBtn = computed(() => {
  return {
    text: t("accept"),
    isOrange: true,
    disabled: newUsername.value.length === 0,
    action: () => changeUsername()
  };
});

interface Avatar {
  source: string;
  isSelected: boolean;
}
</script>

<template>
  <div class="settingsView">
    <div class="accordion">
      <div class="whiteCard">
        <span @click="openTab(1)" class="title">Statystyki konta</span>
        <div v-if="selectedTab === 1" class="stats">
          {{ userStore.user.accountPoints }}
        </div>
      </div>
      <div class="whiteCard">
        <span @click="openTab(2)" class="title">Wybierz swój avatar</span>
        <div v-if="selectedTab === 2" class="avatars">
          <img @click="changeAvatar(avatar)" v-for="avatar in avatars" :src="avatar.source" alt="Lisek" :class="{isUserReady: avatar.isSelected}" class="avatar" />
        </div>
      </div>
      <div class="whiteCard">
        <span @click="openTab(3)" class="title">Zmień imię</span>
          <div v-if="selectedTab === 3" class="changeUsername">
            <v-text-field v-model="newUsername" :placeholder="userStore.user.username" hide-details/>
            <HubBtn class="changeUsername_btn" :action="acceptUsernameBtn.action" :text="acceptUsernameBtn.text" :isOrange="acceptUsernameBtn.isOrange" :disabled="acceptUsernameBtn.disabled"/>
          </div>
        </div>
    <div class="whiteCard">
      <span class="title">Zarządzaj pytaniami</span>
    </div>
    
  </div>
  <div class="controls">
    <HubBtn class="controls_btn" :action="btns[0].action" :text="btns[0].text" :isOrange="btns[0].isOrange"/>
    <HubBtn class="controls_btn" :action="btns[1].action" :text="btns[1].text" :isOrange="btns[1].isOrange" :disabled="btns[1].disabled"/>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
.settingsView {
  background: $mainBackground;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .changeUsername {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 12px;

    &_btn {
      padding: 6px;
      font-size: 18px;
      width: auto;
    }
  }

  .accordion {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    gap: 24px;
  }

  .title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
    }
  .avatars {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding-top: 12px;
  }
  .avatar {
    background-color: white;
    height: 56px;
    width: 56px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 50%;
    padding: 2px;

    &.isUserReady {
      border: 2px solid $mainBrownColor;
      transform: scale(1.1);
    }
  }

  .controls {
      display: flex;
      gap: 12px;

      &_btn {
        padding: 12px 24px;
      }
    }
}
</style>
