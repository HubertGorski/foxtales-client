<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useUserStore } from "@/stores/userStore";
import type { Avatar } from "@/models/Avatar";
import { avatars } from "@/assets/data/avatars";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import LevelBar from "@/components/LevelBar.vue";
import { ICON } from "@/enums/iconsEnum";

const userStore = useUserStore();

const router = useRouter();

const newUsername = ref<string>("");
const currentUser = userStore.user;

const changeAvatar = (avatar: Avatar) => {
  userStore.setAvatar(avatar);
};

const changeUsername = () => {
  userStore.setUsername(newUsername.value);
  newUsername.value = "";
};
const allUserAchievements = currentUser.achievements.sort(
  (a, b) => Number(b.isUnlocked) - Number(a.isUnlocked)
);
const unlockedAchievementsCount = allUserAchievements.filter(achievement => achievement.isUnlocked).length;

const actualAvatars = ref<Avatar[]>(avatars);

const goToQuestionsPanel = () => {
  router.push(ROUTE_PATH.QUESTIONS_PANEL);
};

const showAllAchievement = () => {
  console.log("showAllAchievement");
};

const btns = [
  {
    id: 1,
    text: "back",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    id: 2,
    text: "shop",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true,
  },
];

const acceptUsernameBtn = computed(() => {
  return {
    text: "accept",
    isOrange: true,
    disabled: newUsername.value.length === 0,
    action: () => changeUsername(),
  };
});
</script>

<template>
  <div class="settingsView">
    <div class="settings">
      <HubAccordion :slotNames="['accountStats', 'chooseFox', 'changeName']" setOpenTab="accountStats">
        <template #accountStats>
          <div class="accordionContent">
            <LevelBar
              :level="currentUser.level"
              :points="currentUser.accountPoints"
              :requiredPointsToNextLevel="
                currentUser.requiredAccountPointsToNextLevel
              "
            />
            <div class="stats">
              <div class="stats_element">
                <v-icon>{{ ICON.ANSWER }}</v-icon>
                <span
                  >Udzielone odpowiedzi: {{ currentUser.answersCount }}</span
                >
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.GAME }}</v-icon>
                <span>Rozegrane gry: {{ currentUser.totalGamesPlayed }}</span>
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.QUESTION }}</v-icon>
                <span
                  >Publiczne pytania:
                  {{ currentUser.publicQuestionsCount }}</span
                >
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.ACHIEVEMENT }}</v-icon>
                <span
                  >Osiągnięcia: {{ unlockedAchievementsCount }} /
                  {{ allUserAchievements.length }}</span
                >
              </div>
              <div class="achievements">
                <div class="achievements_list">
                  <img
                    v-for="achievement in allUserAchievements"
                    :key="achievement.id"
                    :class="{
                      unlocked: achievement.isUnlocked
                    }"
                    class="achievement"
                    :src="achievement.icon"
                    :alt="`${achievement.getUnlockedLevel}`"
                  />
                </div>
              </div>
            </div>
            <HubBtn
              class="achievements_btn"
              text="seeMore"
              :icon="ICON.MINI_ARROW_RIGHT"
              :action="showAllAchievement"
            />
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
                  isUserReady: avatar.isSelected(currentUser.avatar),
                  isDisabled: avatar.isDisabled(currentUser.avatarsIds),
                }"
                class="avatar_img"
              />
              <v-icon
                v-if="avatar.isDisabled(currentUser.avatarsIds)"
                class="avatar_lock"
                >{{ ICON.LOCK }}</v-icon
              >
            </div>
          </div>
        </template>
        <template #changeName>
          <HubInputWithBtn
            v-model="newUsername"
            class="accordionContent"
            :btnAction="acceptUsernameBtn.action"
            :btnText="acceptUsernameBtn.text"
            :btnIsOrange="acceptUsernameBtn.isOrange"
            :textPlaceholder="currentUser.username"
            dictsDisabled
          />
        </template>
      </HubAccordion>
      <div @click="goToQuestionsPanel" class="settings_elementWithFox">
        <img
        class="fox"
        src="@/assets/imgs/7.png"
        alt="Lisek"
        />
        <HubAccordionElement title="manageLibrary" isTitleCenter />
      </div>
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

    &_elementWithFox {
      position: relative;

      .fox {
        position: absolute;
        width: 78px;
        bottom: 0;
        left: 0;
        border-radius: 12px;
      }
    }
  }

  .stats {
    padding-top: 12px;

    &_element {
      display: flex;
      gap: 12px;
      color: $grayColor;
      padding: 2px 4px;

      .v-icon {
        color: $mainBrownColor;
      }
    }
  }

  .avatars {
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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

  .accordionContent {
    padding: 16px;
  }

  .achievements {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px;
    &_list {
      display: flex;
      gap: 8px;
    }
    &_btn {
      font-size: 12px;
      width: min-content;
      height: min-content;
      padding: 8px 8px 8px 16px;
      margin-left: auto;
    }
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
