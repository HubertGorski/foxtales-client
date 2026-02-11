<script setup lang="ts">
  import { computed } from 'vue';
  import HubPopup from './hubComponents/HubPopup.vue';
  import HubBtn from './hubComponents/HubBtn.vue';
  import { useUserStore } from '@/stores/userStore';
  import { getCatalogImg } from '@/utils/imgUtils';
  import { RULES_I18N_DESC, RULES_I18N_KEY } from '@/enums/rulesEnum';
  import { ICON } from '@/enums/iconsEnum';
  import IsComingMask from './isComingMask.vue';

  const selectedCatalogId = defineModel<number | null>({
    required: false,
    default: null,
  });

  const emit = defineEmits<{
    (e: 'setSelectedCatalogId', value: null): void;
    (e: 'selectCatalog'): void;
    (e: 'confirmSelection'): void;
  }>();

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
    return useUserStore().publicCatalogs.find(
      catalog => catalog.catalogId === selectedCatalogId.value
    )!;
  });
</script>

<template>
  <div class="catalogDetails">
    <HubPopup v-model="isCatalogDetailsVisible">
      <div v-if="catalog" class="catalogDetails_card">
        <div class="catalogDetails_header">
          <HubBtn text="back" :action="goBack" ghost small />
          <HubBtn text="continue" :action="confirmSelection" isOrange small />
        </div>
        <IsComingMask v-if="true" :isAbsolute="false" isComingText="isComingDetails" />
        <div v-else class="catalogDetails_content">
          <div class="catalogDetails_title">
            {{ catalog.title }}
          </div>
          <div class="catalogDetails_img">
            <img :src="getCatalogImg(catalog.catalogId ?? 0)" alt="Lisek" />
          </div>
          <div class="catalogDetails_section">
            <div class="catalogDetails_sectionTitle">
              <v-icon>{{ ICON.INFO }}</v-icon>
              {{ $t('description') }}
            </div>
            <div class="catalogDetails_description">
              {{
                catalog.description ??
                'Lorem ipsum superanckiego opisu katalogu. W grze odpowiadamy na imprezowe pytania itd.'
              }}
            </div>
          </div>
          <div v-if="catalog.recommendedGameRules" class="catalogDetails_section">
            <div class="catalogDetails_sectionTitle">
              <v-icon>{{ ICON.POINTS }}</v-icon>
              {{ $t(RULES_I18N_KEY[catalog.recommendedGameRules]) }}
            </div>
            <div class="catalogDetails_rulesDescription">
              {{ $t(RULES_I18N_DESC[catalog.recommendedGameRules]) }}
            </div>
          </div>
          <div class="catalogDetails_section">
            <div class="catalogDetails_sectionTitle">
              <v-icon>{{ ICON.QUESTION_OUTLINE }}</v-icon>
              <span>Przykładowe pytania w grze</span>
            </div>
            <div class="catalogDetails_questions">
              <span>{{ catalog.questionsInCatalogCount ?? 124 }} pytań w grze</span>
              <span v-for="question in catalog.questions" class="whiteCard whiteCardContent">
                {{ `"${question.text}", ` }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </HubPopup>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .catalogDetails {
    &_card {
      display: flex;
      flex-direction: column;
      background: $background;
      width: 100%;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.15),
        0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      overflow: hidden;
    }

    &_content {
      overflow-y: scroll;
    }

    &_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: linear-gradient(135deg, $mainBrownColor, $lightBrownColor);
      gap: 12px;
    }

    &_title {
      padding: 16px 20px 8px;
      font-size: 20px;
      font-weight: 700;
      color: $mainBrownColor;
      text-align: center;
      letter-spacing: -0.5px;
    }

    &_img {
      padding: 8px 24px 16px;
      display: flex;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 140px;
        border: 2px solid $lightBrownColor;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        object-fit: cover;
      }
    }

    &_questions {
      padding: 12px;
      span {
        display: block;
        text-align: start;
      }
    }
  }
</style>
