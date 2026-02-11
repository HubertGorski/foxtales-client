<script setup lang="ts">
  import { computed, ref } from 'vue';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import { useUserStore } from '@/stores/userStore';
  import type { Avatar } from '@/models/Avatar';
  import HubAccordion from '@/components/hubComponents/HubAccordion.vue';
  import HubInputWithBtn from '@/components/hubComponents/HubInputWithBtn.vue';
  import LevelBar from '@/components/LevelBar.vue';
  import { ICON } from '@/enums/iconsEnum';
  import WhiteSelectList from '@/components/selectLists/WhiteSelectList.vue';
  import { useI18n } from 'vue-i18n';
  import { LANG, languagesMap } from '@/enums/languagesEnum';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { ListElement } from '@/components/selectLists/ListElement';
  import { userService } from '@/api/services/UserService';
  import { isEqual } from 'lodash';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { getAvatar } from '@/utils/imgUtils';
  import HubAccordionElement from '@/components/hubComponents/HubAccordionElement.vue';
  import Terms from '@/components/Terms.vue';
  import HubSwitch from '@/components/hubComponents/HubSwitch.vue';
  import HubDivider from '@/components/hubComponents/HubDivider.vue';
  import HubDialogPopup from '@/components/hubComponents/HubDialogPopup.vue';
  import { emailService } from '@/api/services/EmailService';
  import { toggleWakeLock } from '@/libs/wakeLock';

  const userStore = useUserStore();
  const { t, locale } = useI18n();

  const currentUser = userStore.user;

  const translatedLanguages = computed(() => [
    t('languages.polish'),
    t('languages.english'),
    t('languages.german'),
    t('languages.french'),
    t('languages.spanish'),
  ]);

  const mailContent = ref<string>('');
  const isContactDisabled = ref<boolean>(false);
  const isConfirmFoxPanelVisible = ref<boolean>(false);
  const selectedAvatar = ref<Avatar | null>(null);

  const languages = ref<ListElement[]>([
    new ListElement({
      id: 0,
      title: translatedLanguages.value[0],
      description: '',
      isSelected: currentUser.language === LANG.PL,
    }),
    new ListElement({
      id: 1,
      title: translatedLanguages.value[1],
      description: '',
      isSelected: currentUser.language === LANG.EN,
    }),
    new ListElement({
      id: 2,
      title: translatedLanguages.value[2],
      description: '',
      isSelected: currentUser.language === LANG.DE,
    }),
    new ListElement({
      id: 3,
      title: translatedLanguages.value[3],
      description: '',
      isSelected: currentUser.language === LANG.FR,
    }),
    new ListElement({
      id: 4,
      title: translatedLanguages.value[4],
      description: '',
      isSelected: currentUser.language === LANG.ES,
    }),
  ]);

  const allUserAchievements = currentUser.achievements.sort(
    (a, b) => Number(b.isUnlocked) - Number(a.isUnlocked)
  );
  const unlockedAchievementsCount = allUserAchievements.filter(
    achievement => achievement.isUnlocked
  ).length;

  const showAllAchievement = () => {};

  const changeLanguage = () => {
    userStore.setLanguage(selectedLanguage.value);
    locale.value = selectedLanguage.value;
    languages.value.forEach((lang, index) => {
      lang.title = translatedLanguages.value[index];
    });
  };

  const showConfirmFoxPanel = async (avatar: Avatar) => {
    if (isEqual(userStore.getAvatar(), avatar)) {
      return;
    }

    isConfirmFoxPanelVisible.value = true;
    selectedAvatar.value = avatar;
  };

  const closeConfirmAvatarDialog = async () => {
    isConfirmFoxPanelVisible.value = false;
    selectedAvatar.value = null;
  };

  const changeAvatar = async () => {
    if (!selectedAvatar.value) {
      return;
    }

    const response = await userService.setAvatar(selectedAvatar.value.id);
    if (response) {
      userStore.setAvatar(selectedAvatar.value);
      closeConfirmAvatarDialog();
    }
  };

  const contact = async () => {
    isContactDisabled.value = true;
    await emailService.contact(mailContent.value, currentUser);
  };

  const schema = yup.object({
    username: yup.string(),
  });
  const { handleSubmit, setFieldError } = useForm({
    validationSchema: schema,
  });
  const { value: username, errorMessage: usernameError } = useField('username');
  username.value = '';

  const changeUsername = handleSubmit(async values => {
    try {
      const response = await userService.setUsername(values.username);
      if (response) {
        userStore.setUsername(values.username);
        username.value = '';
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            setFieldError(field.toLowerCase(), t(`auth.${messages[0]}`));
          }
        });
      }
    }
  });

  const sortedAvatars = computed(() => {
    const lockedAvatars = userStore.avatars.filter(avatar =>
      avatar.isDisabled(currentUser.avatarsIds)
    );

    const unlockedAvatars = userStore.avatars.filter(
      avatar => !avatar.isDisabled(currentUser.avatarsIds)
    );

    return [...unlockedAvatars, ...lockedAvatars];
  });

  const fox = computed(() => {
    return new URL(`/src/assets/imgs/${selectedAvatar.value?.id}.webp`, import.meta.url).href;
  });

  const selectedLanguage = computed(
    () => languagesMap[languages.value.find(lang => lang.isSelected)!.id]
  );

  const acceptUsernameBtn = computed(() => {
    return {
      text: 'accept',
      isOrange: true,
      disabled: !!usernameError.value,
      action: () => changeUsername(),
    };
  });

  const acceptLanguageBtn = computed(() => {
    return {
      text: 'accept',
      isOrange: true,
      disabled: currentUser.language === selectedLanguage.value,
      action: () => changeLanguage(),
    };
  });

  const contactBtn = computed(() => {
    return {
      text: isContactDisabled.value ? 'messageHasBeenSent' : 'send',
      isOrange: false,
      disabled: !mailContent.value || isContactDisabled.value,
      action: () => contact(),
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
          { slotName: 'wakeLock', isComing: false },
          { slotName: 'contact', isComing: false },
        ]"
        setOpenTab="accountStats"
      >
        <template #accountStats>
          <div class="accordionContent">
            <LevelBar
              :level="currentUser.level"
              :points="currentUser.accountPoints"
              :requiredPointsToNextLevel="currentUser.requiredAccountPointsToNextLevel"
            />
            <div class="stats">
              <div class="stats_element">
                <v-icon>{{ ICON.ANSWER }}</v-icon>
                <span>{{ $t('stats.answers') }}: {{ currentUser.answersCountPsych }}</span>
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.GAME }}</v-icon>
                <span>{{ $t('stats.games') }}: {{ currentUser.totalGamesPlayed }}</span>
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.QUESTION }}</v-icon>
                <span>
                  {{ $t('stats.publicQuestions') }}: {{ currentUser.publicQuestionsCount }}
                </span>
              </div>
              <div class="stats_element">
                <v-icon>{{ ICON.ACHIEVEMENT }}</v-icon>
                <span>
                  {{ $t('stats.achievements') }}: {{ unlockedAchievementsCount }} /
                  {{ allUserAchievements.length }}
                </span>
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
            <div v-for="avatar in sortedAvatars" :key="avatar.id" class="avatar">
              <img
                :src="getAvatar(avatar.id)"
                alt="Lisek"
                :class="{
                  isSelected: avatar.isSelected(currentUser.avatar),
                  isDisabled: avatar.isDisabled(currentUser.avatarsIds),
                }"
                class="avatar_img"
                @click="showConfirmFoxPanel(avatar)"
              />
              <v-icon v-if="avatar.isDisabled(currentUser.avatarsIds)" class="avatar_lock">
                {{ ICON.LOCK }}
              </v-icon>
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
            <HubDivider :text="$t('changeInterfaceLanguage')" />
            <WhiteSelectList v-model="languages" :itemsPerPage="10" />
            <HubBtn
              class="setLangBtn"
              :action="acceptLanguageBtn.action"
              :text="acceptLanguageBtn.text"
              :isOrange="acceptLanguageBtn.isOrange"
              :disabled="acceptLanguageBtn.disabled"
            />
            <HubDivider class="pt-4" :text="$t('advancedSettings')" />
            <HubSwitch
              v-model="userStore.user.useAiTranslations"
              label="aiLiveTranslation"
              tooltipText="aiLiveTranslationTooltip"
              :inset="false"
              color="brown"
            />
          </div>
        </template>
        <template #wakeLock>
          <div class="accordionContent">
            <HubSwitch
              v-model="userStore.user.useWakeLock"
              label="wakeLockLabel"
              tooltipText="wakeLockTooltip"
              :inset="false"
              color="brown"
              @onSwitchChange="toggleWakeLock"
            />
          </div>
        </template>
        <template #contact>
          <div class="contactTooltip">
            {{ $t('contactTooltip') }}
          </div>
          <HubInputWithBtn
            v-model="mailContent"
            class="accordionContent"
            :btnAction="contactBtn.action"
            :btnText="contactBtn.text"
            :btnIsOrange="contactBtn.isOrange"
            :btnIsDisabled="contactBtn.disabled"
            :inputDisabled="isContactDisabled"
            isTextarea
          />
        </template>
      </HubAccordion>
      <Terms :isLabelVisible="false">
        <HubAccordionElement title="terms.termsAndPrivacyPolicy" isSmallerTitle @click="" />
      </Terms>
      <HubDialogPopup
        v-model="isConfirmFoxPanelVisible"
        :textPopup="$t('confirmAvatar')"
        :confirmAction="changeAvatar"
        :backAction="closeConfirmAvatarDialog"
        :showDefaultImg="false"
      >
        <div class="selectedFox">
          <img :src="fox" alt="Lisek" class="selectedFox_img" />
        </div>
      </HubDialogPopup>
    </div>
    <NavigationBtns class="pl-1 pr-1 pb-1 pt-1" btn="back" btn2="shop" btn2Disabled />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  .settingsView {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .settings {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
      gap: 12px;
      padding: 12px;
      background: $darkBackground;
    }

    .selectedFox {
      display: flex;
      justify-content: center;
      &_img {
        height: 180px;
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
      padding: 12px 16px;

      .setLangBtn {
        margin-top: 12px;
        padding: 6px;
      }
    }

    .contactTooltip {
      padding: 12px 16px 0 16px;
      color: $grayColor;
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
