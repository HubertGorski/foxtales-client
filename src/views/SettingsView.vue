<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useUserStore } from "@/stores/userStore";
import type { Avatar } from "@/models/Avatar";
import { avatars } from "@/assets/data/avatars";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubInputBox from "@/components/hubComponents/HubInputBox.vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";

const userStore = useUserStore();

const { t } = useI18n();
const router = useRouter();

const selectedTab = ref<number>(0);
const newUsername = ref<string>("");

const changeAvatar = (avatar: Avatar) => {
  userStore.setAvatar(avatar.source);
  actualAvatars.value.map((avatar) => (avatar.isSelected = false));
  avatar.isSelected = true;
};

const changeUsername = () => {
  userStore.setUsername(newUsername.value);
  newUsername.value = "";
};

const openTab = (tab: number) => {
  selectedTab.value = selectedTab.value === tab ? 0 : tab;
};

const unlockedAchievementsCount = computed(
  () =>
    userStore.user.achievements.filter((achievement) => achievement.unlockDate)
      .length
);

const actualAvatars = ref<Avatar[]>(avatars);

const goToQuestionsPanel = () => {
  router.push(ROUTE_PATH.QUESTIONS_PANEL);
};

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    id: 2,
    text: "Kup premium",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true,
  },
];

const acceptUsernameBtn = computed(() => {
  return {
    text: t("accept"),
    isOrange: true,
    disabled: newUsername.value.length === 0,
    action: () => changeUsername(),
  };
});
</script>

<template>
  <div class="settingsView">
    <div class="settings">
      <HubAccordion :slotNames="['accountStats', 'chooseFox', 'changeName']">
        <template #accountStats>
          <div class="stats">
            <div class="stats_element">
              <v-icon>mdi-star</v-icon>
              <span
                >Doświadczenie: {{ userStore.user.accountPoints }} /
                {{ userStore.user.requiredAccountPointsToNextLevel }}</span
              >
            </div>
            <div class="stats_element">
              <v-icon>mdi-bolt</v-icon>
              <span>Poziom: {{ userStore.user.level }}</span>
            </div>
            <div class="stats_element">
              <v-icon>mdi-help-circle</v-icon>
              <span
                >Publiczne pytania:
                {{ userStore.user.publicQuestionsCount }}</span
              >
            </div>
            <div class="stats_element">
              <v-icon>mdi-comment</v-icon>
              <span
                >Udzielone odpowiedzi: {{ userStore.user.answersCount }}</span
              >
            </div>
            <div class="stats_element">
              <v-icon>mdi-gamepad-variant</v-icon>
              <span>Rozegrane gry: {{ userStore.user.totalGamesPlayed }}</span>
            </div>
            <div class="stats_element">
              <v-icon>mdi-trophy</v-icon>
              <span
                >Osiągnięcia: {{ unlockedAchievementsCount }} /
                {{ userStore.user.achievements.length }}</span
              >
            </div>
            <div class="achievement_list">
              <img
                v-for="achievement in userStore.user.achievements"
                :key="achievement.id"
                :class="{ unlocked: achievement.unlockDate }"
                class="achievement"
                :src="achievement.icon"
                alt="Lisek"
              />
            </div>
          </div>
        </template>
        <template #chooseFox>
          <div class="avatars">
            <div
              v-for="avatar in actualAvatars"
              :key="avatar.id"
              class="avatar"
            >
              <img
                @click="changeAvatar(avatar)"
                :src="avatar.source"
                alt="Lisek"
                :class="{
                  isUserReady: avatar.isSelected,
                  isDisabled: avatar.isDisabled,
                }"
                class="avatar_img"
              />
              <v-icon v-if="avatar.isDisabled" class="avatar_lock"
                >mdi-lock</v-icon
              >
            </div>
          </div>
        </template>
        <template #changeName>
          <HubInputWithBtn
            v-model="newUsername"
            :btnAction="acceptUsernameBtn.action"
            :btnText="acceptUsernameBtn.text"
            :btnIsOrange="acceptUsernameBtn.isOrange"
            :textPlaceholder="userStore.user.username"
          />
        </template>
      </HubAccordion>
      <HubAccordionElement @click="goToQuestionsPanel" title="manageLibrary" />
    </div>
    <div class="controls">
      <HubBtn
        class="controls_btn"
        :action="btns[0].action"
        :text="btns[0].text"
        :isOrange="btns[0].isOrange"
      />
      <HubBtn
        class="controls_btn"
        :action="btns[1].action"
        :text="btns[1].text"
        :isOrange="btns[1].isOrange"
        :disabled="btns[1].disabled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.settingsView {
  background: $mainBackground;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .settings {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    flex-grow: 1;
  }

  .stats {
    padding-top: 12px;

    &_element {
      display: flex;
      gap: 12px;
      color: $grayColor;

      .v-icon {
        color: $mainBrownColor;
      }
    }
  }

  .avatars {
    padding-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;

    .avatar {
      position: relative;

      &_lock {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        opacity: 0.4;
        font-size: 32px;
      }

      &_img {
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

        &.isDisabled {
          filter: brightness(50%) grayscale(80%) contrast(90%);
          pointer-events: none;
        }
      }
    }
  }

  .achievement_list {
    display: flex;
    gap: 8px;
    padding-top: 12px;
  }

  .achievement {
    background-color: white;
    height: 42px;
    width: 42px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 50%;
    padding: 2px;
    filter: brightness(50%) grayscale(80%) contrast(90%);

    &.unlocked {
      filter: none;
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
