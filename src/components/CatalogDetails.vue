<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import HubPopup from './hubComponents/HubPopup.vue';
  import HubBtn from './hubComponents/HubBtn.vue';
  import { useUserStore } from '@/stores/userStore';
  import { getCatalogImg } from '@/utils/imgUtils';
  import { RULES, RULES_I18N_KEY } from '@/enums/rulesEnum';
  import { ICON } from '@/enums/iconsEnum';
  import InfoGame from './InfoGame.vue';

  const selectedCatalogId = defineModel<number | null>({
    required: false,
    default: null,
  });

  const emit = defineEmits<{
    (e: 'setSelectedCatalogId', value: null): void;
    (e: 'selectCatalog'): void;
    (e: 'confirmSelection'): void;
  }>();

  const userStore = useUserStore();
  const goBack = () => {
    selectedCatalogId.value = null;
    emit('setSelectedCatalogId', null);
  };

  const confirmSelection = () => {
    emit('confirmSelection');
    goBack();
  };

  const isCatalogDetailsVisible = computed({
    get: () => !!selectedCatalogId.value,
    set: value => {
      if (!value) {
        goBack();
      }
    },
  });

  const catalog = computed(() => {
    return userStore.publicCatalogs.find(catalog => catalog.catalogId === selectedCatalogId.value)!;
  });

  const rulesHtml = ref<string>('');

  const RULES_HTML_FILE: Record<RULES, string> = {
    [RULES.PSYCH]: `rules/${userStore.user.language}/psych.html`,
    [RULES.DIXIT]: `rules/${userStore.user.language}/dixit.html`,
    [RULES.QUIET_DAYS]: `rules/${userStore.user.language}/quietDays.html`,
  };

  const RULES_PLAYERS_TEXT: Record<RULES, string> = {
    [RULES.PSYCH]: 'catalog.psych.playersCount',
    [RULES.DIXIT]: 'catalog.dixit.playersCount',
    [RULES.QUIET_DAYS]: 'catalog.quietDays.playersCount',
  };

  const RULES_PLAYERS_SUBTEXT: Record<RULES, string> = {
    [RULES.PSYCH]: 'catalog.psych.bestWith',
    [RULES.DIXIT]: 'catalog.dixit.bestWith',
    [RULES.QUIET_DAYS]: 'catalog.quietDays.bestWith',
  };

  const RULES_MODE_TEXT: Record<RULES, string> = {
    [RULES.PSYCH]: 'catalog.solo',
    [RULES.DIXIT]: 'catalog.solo',
    [RULES.QUIET_DAYS]: 'catalog.soloOrTeam',
  };

  const RULES_MODE_SUBTEXT: Record<RULES, string> = {
    [RULES.PSYCH]: 'catalog.noTeams',
    [RULES.DIXIT]: 'catalog.noTeams',
    [RULES.QUIET_DAYS]: 'catalog.availableModes',
  };

  // const RULES_MODE_ICON: Record<RULES, ICON> = {
  //   [RULES.PSYCH]: ICON.X,
  //   [RULES.DIXIT]: ICON.X,
  //   [RULES.QUIET_DAYS]: ICON.CHECK,
  // }; TODO: podjac decyzje czy z ikonką czy bez

  watch(
    () => catalog.value?.recommendedGameRules,
    async rules => {
      if (rules == null) {
        rulesHtml.value = '';
        return;
      }

      const file = RULES_HTML_FILE[rules];
      try {
        const response = await fetch(file);
        rulesHtml.value = await response.text();
      } catch {
        rulesHtml.value = '';
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="catalogDetails">
    <HubPopup v-model="isCatalogDetailsVisible">
      <div v-if="catalog" class="catalogDetails_card">
        <div class="catalogDetails_header">
          <HubBtn text="back" :action="goBack" ghost small />
          <span class="catalogDetails_headerTitle">{{ catalog.title }}</span>
          <HubBtn text="continue" :action="confirmSelection" isOrange small />
        </div>
        <div class="catalogDetails_content">
          <div class="catalogDetails_imgWrapper">
            <img :src="getCatalogImg(catalog.photoId)" alt="Lisek" />
          </div>
          <div class="catalogDetails_title">
            {{ catalog.title }}
          </div>
          <div class="catalogDetails_body">
            <div v-if="catalog.description" class="catalogDetails_section">
              <div class="catalogDetails_sectionTitle">
                <v-icon>{{ ICON.INFO }}</v-icon>
                {{ $t('description') }}
              </div>
              <p class="catalogDetails_description">
                {{ catalog.description }}
              </p>
            </div>
            <div class="catalogDetails_section">
              <div class="catalogDetails_sectionTitle">
                <v-icon>{{ ICON.QUESTION_OUTLINE }}</v-icon>
                <span>{{ $t('catalog.sampleQuestions') }}</span>
                <span class="catalogDetails_questionsBadge">
                  {{ catalog.questionsInCatalogCount ?? 0 }}
                </span>
              </div>
              <div class="catalogDetails_questions">
                <span v-for="question in catalog.questions" :key="question.text" class="infoBlock">
                  „{{ question.text.split('****').join('Adam') }}"
                </span>
              </div>
            </div>

            <div v-if="rulesHtml" class="catalogDetails_section">
              <div class="catalogDetails_sectionTitle">
                <v-icon>{{ ICON.POINTS }}</v-icon>
                {{ $t('catalog.gameRules') }}:
                {{ $t(RULES_I18N_KEY[catalog.recommendedGameRules]) }}
              </div>
              <div class="infoGameBoxes">
                <InfoGame
                  :title="$t('catalog.players')"
                  :mainIcon="ICON.USERS"
                  :text="$t(RULES_PLAYERS_TEXT[catalog.recommendedGameRules])"
                  :subtext="$t(RULES_PLAYERS_SUBTEXT[catalog.recommendedGameRules])"
                />
                <InfoGame
                  :title="$t('catalog.mode')"
                  :mainIcon="ICON.GAME"
                  :text="$t(RULES_MODE_TEXT[catalog.recommendedGameRules])"
                  :subtext="$t(RULES_MODE_SUBTEXT[catalog.recommendedGameRules])"
                />
              </div>
              <div class="catalogDetails_rules" v-html="rulesHtml" />
            </div>
          </div>
        </div>
      </div>
    </HubPopup>
  </div>
</template>

<style lang="scss">
  @use '@/assets/styles/variables' as *;

  .catalogDetails {
    &_card {
      display: flex;
      flex-direction: column;
      background: $background;
      width: 100%;
      max-width: 356px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow:
        0 12px 40px rgb(0, 0, 0, 0.18),
        0 2px 8px rgb(0, 0, 0, 0.08);
    }

    &_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: linear-gradient(135deg, $mainBrownColor, $lightBrownColor);
      gap: 8px;
    }

    &_headerTitle {
      color: $whiteColor;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.3px;
    }

    &_content {
      overflow-y: auto;
      max-height: 78vh;
    }

    &_imgWrapper {
      display: flex;
      justify-content: center;
      padding: 16px 24px 4px;

      img {
        max-width: 100%;
        max-height: 130px;
        border: 2px solid $darkBackground;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgb(0, 0, 0, 0.1);
        object-fit: cover;
      }
    }

    &_title {
      font-size: 20px;
      font-weight: 700;
      color: $mainBrownColor;
      text-align: center;
      letter-spacing: -0.5px;
      padding: 8px 20px 4px;
    }

    &_body {
      padding: 0 20px 20px;
    }

    &_section {
      padding: 14px 0;
      border-top: 1px solid $darkBackground;

      &:last-child {
        padding-bottom: 0;
      }
    }

    &_sectionTitle {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      color: $mainBrownColor;
      margin-bottom: 8px;
      letter-spacing: -0.2px;

      .v-icon {
        font-size: 20px;
        color: $mainOrangeColor;
      }
    }

    &_description {
      margin: 0;
      font-size: 14px;
      line-height: 1.55;
      color: $grayColor;
    }

    &_questionsBadge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 22px;
      padding: 0 6px;
      border-radius: 11px;
      background: $mainOrangeColor;
      color: $whiteColor;
      font-size: 12px;
      font-weight: 700;
      margin-left: auto;
    }

    &_questions {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .infoGameBoxes {
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    &_rules {
      padding: 4px 0 0;
      font-size: 14px;
      line-height: 1.55;
      color: $grayColor;

      h3 {
        font-size: 0.95rem;
        font-weight: 600;
        color: $mainBrownColor;
        margin: 1rem 0 0.4rem;
      }

      p {
        margin: 0.3rem 0 0.8rem;
      }

      .meta {
        font-size: 0.85rem;
        color: $mainBrownColor;
        margin-bottom: 0.8rem;
        line-height: 1.5;

        strong {
          color: $mainOrangeColor;
          font-weight: 700;
        }
      }

      .team-yes {
        color: $mainOrangeColor;
        font-weight: 700;
      }

      .team-no {
        color: $darkerOrangeColor;
        font-weight: 700;
      }

      .emoji {
        font-size: 1rem;
        margin-right: 0.25rem;
      }

      ol,
      ul {
        padding-left: 1.4rem;
        margin: 0.4rem 0 0.8rem;
      }

      li {
        margin-bottom: 0.35rem;
        font-size: 0.88rem;
      }

      .highlight {
        color: $mainOrangeColor;
        font-weight: 700;
      }

      .final-rule {
        font-size: 0.92rem;
        font-weight: 600;
        color: $mainOrangeColor;
        text-align: center;
        margin: 1rem 0 0.4rem;
        padding: 0.6rem 0;
        border-top: 1px solid $darkBackground;
        border-bottom: 1px solid $darkBackground;
      }

      .game-section {
        margin-bottom: 0;
      }
    }
  }
</style>
