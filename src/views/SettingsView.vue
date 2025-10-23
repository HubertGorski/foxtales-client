<script setup lang="ts">
import { computed, ref } from "vue";
import HubBtn from "@/components/hubComponents/HubBtn.vue";
import { useUserStore } from "@/stores/userStore";
import type { Avatar } from "@/models/Avatar";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import LevelBar from "@/components/LevelBar.vue";
import { ICON } from "@/enums/iconsEnum";
import WhiteSelectList from "@/components/selectLists/WhiteSelectList.vue";
import { useI18n } from "vue-i18n";
import { LANG, languagesMap } from "@/enums/languagesEnum";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { ListElement } from "@/components/selectLists/ListElement";
import { userService } from "@/api/services/UserService";
import { isEqual } from "lodash";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { getAvatar } from "@/utils/imgUtils";

const userStore = useUserStore();
const { t, locale } = useI18n();

const currentUser = userStore.user;

const translatedLanguages = computed(() => [
  t("languages.polish"),
  t("languages.english"),
  t("languages.german"),
]);

const languages = ref<ListElement[]>([
  new ListElement({
    id: 0,
    title: translatedLanguages.value[0],
    description: "",
    isSelected: currentUser.language === LANG.PL,
  }),
  new ListElement({
    id: 1,
    title: translatedLanguages.value[1],
    description: "",
    isSelected: currentUser.language === LANG.EN,
  }),
  new ListElement({
    id: 2,
    title: translatedLanguages.value[2],
    description: "",
    isSelected: currentUser.language === LANG.DE,
  }),
]);

const allUserAchievements = currentUser.achievements.sort(
  (a, b) => Number(b.isUnlocked) - Number(a.isUnlocked)
);
const unlockedAchievementsCount = allUserAchievements.filter(
  (achievement) => achievement.isUnlocked
).length;

const showAllAchievement = () => {
  console.log("showAllAchievement");
};

const changeLanguage = () => {
  userStore.setLanguage(selectedLanguage.value);
  locale.value = selectedLanguage.value;
  languages.value.forEach((lang, index) => {
    lang.title = translatedLanguages.value[index];
  });
};

const changeAvatar = async (avatar: Avatar) => {
  if (isEqual(userStore.getAvatar(), avatar)) {
    return;
  }

  const response = await userService.setAvatar(avatar.id);
  if (response) {
    userStore.setAvatar(avatar);
  }
};

const schema = yup.object({
  username: yup.string(),
});
const { handleSubmit, setFieldError } = useForm({
  validationSchema: schema,
});
const { value: username, errorMessage: usernameError } = useField("username");
username.value = "";

const changeUsername = handleSubmit(async (values) => {
  try {
    const response = await userService.setUsername(values.username);
    if (response) {
      userStore.setUsername(values.username);
      username.value = "";
    }
  } catch (err: any) {
    const data = err?.response?.data;
    if (data?.errors) {
      Object.entries(data.errors).forEach(
        ([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            setFieldError(field.toLowerCase(), t(`auth.${messages[0]}`));
          }
        }
      );
    }
  }
});

const sortedAvatars = computed(() => {
  const lockedAvatars = userStore.avatars.filter((avatar) =>
    avatar.isDisabled(currentUser.avatarsIds)
  );

  const unlockedAvatars = userStore.avatars.filter(
    (avatar) => !avatar.isDisabled(currentUser.avatarsIds)
  );

  return [...unlockedAvatars, ...lockedAvatars];
});

const selectedLanguage = computed(
  () => languagesMap[languages.value.find((lang) => lang.isSelected)!.id]
);

const acceptUsernameBtn = computed(() => {
  return {
    text: "accept",
    isOrange: true,
    disabled: !!usernameError.value,
    action: () => changeUsername(),
  };
});

const acceptLanguageBtn = computed(() => {
  return {
    text: "accept",
    isOrange: true,
    disabled: currentUser.language === selectedLanguage.value,
    action: () => changeLanguage(),
  };
});
</script>

<template>
  <div class="settingsView">
    <div class="settings">
      <HubAccordion
        :slotNames="[
          { slotName: 'accountStats', isComing: true },
          { slotName: 'chooseFox', isComing: false },
          { slotName: 'changeName', isComing: false },
          { slotName: 'changeLanguage', isComing: false },
        ]"
        setOpenTab="accountStats"
      >
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
                <span>
                  {{ $t("stats.answers") }}:
                  {{ currentUser.answersCountPsych }}</span
                >
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.GAME }}</v-icon>
                <span>
                  {{ $t("stats.games") }}:
                  {{ currentUser.totalGamesPlayed }}</span
                >
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.QUESTION }}</v-icon>
                <span>
                  {{ $t("stats.publicQuestions") }}:
                  {{ currentUser.publicQuestionsCount }}</span
                >
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.ACHIEVEMENT }}</v-icon>
                <span
                  >{{ $t("stats.achievements") }}:
                  {{ unlockedAchievementsCount }} /
                  {{ allUserAchievements.length }}</span
                >
              </div>
              <div class="achievements">
                <div class="achievements_list">
                  <img
                    v-for="achievement in allUserAchievements"
                    :key="achievement.id"
                    :class="{
                      unlocked: achievement.isUnlocked,
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
              v-for="avatar in sortedAvatars"
              :key="avatar.id"
              class="avatar"
            >
              <img
                @click="changeAvatar(avatar)"
                :src="getAvatar(avatar.id)"
                alt="Lisek"
                :class="{
                  isSelected: avatar.isSelected(currentUser.avatar),
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
            v-model="username"
            class="accordionContent"
            :btnAction="acceptUsernameBtn.action"
            :btnText="acceptUsernameBtn.text"
            :btnIsOrange="acceptUsernameBtn.isOrange"
            :btnIsDisabled="acceptUsernameBtn.disabled"
            :textPlaceholder="currentUser.username"
            :error-messages="usernameError"
            dictsDisabled
          />
        </template>
        <template #changeLanguage>
          <div class="accordionContent">
            <WhiteSelectList v-model="languages" />
            <HubBtn
              class="setLangBtn"
              :action="acceptLanguageBtn.action"
              :text="acceptLanguageBtn.text"
              :isOrange="acceptLanguageBtn.isOrange"
              :disabled="acceptLanguageBtn.disabled"
            />
          </div>
        </template>
      </HubAccordion>
    </div>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.settingsView {
  background: $mainBackground;
  height: 100%;
  padding: 12px;
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

        &.isSelected {
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

    .setLangBtn {
      margin-top: 12px;
      padding: 6px;
    }
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
}
</style>
