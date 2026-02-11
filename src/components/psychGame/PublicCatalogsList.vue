<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { RULES_I18N_KEY } from '@/enums/rulesEnum';
  import { getCatalogImg } from '@/utils/imgUtils';
  import { type PropType } from 'vue';
  import type { ListElement } from '../selectLists/ListElement';

  const emit = defineEmits<{
    (e: 'setSelectedCatalogId', id: number): void;
  }>();

  const publicCatalogs = defineModel({
    type: Array as PropType<Array<ListElement>>,
    required: true,
  });

  const selectCatalog = (id: number) => {
    emit('setSelectedCatalogId', id);
  };
</script>

<template>
  <div class="publicCatalogs">
    <div
      v-for="publicCatalog in publicCatalogs"
      :key="publicCatalog.id"
      class="publicCatalog"
      @click="selectCatalog(publicCatalog.id)"
    >
      <div class="publicCatalog_title">
        {{ publicCatalog.title }}
      </div>
      <div v-if="publicCatalog.photoId" class="publicCatalog_img">
        <img :src="getCatalogImg(publicCatalog.photoId)" alt="Lisek" />
      </div>
      <div v-if="publicCatalog.recommendedGameRules != null" class="publicCatalog_type">
        <v-icon>{{ ICON.POINTS }}</v-icon>
        {{ $t(RULES_I18N_KEY[publicCatalog.recommendedGameRules]) }}
      </div>
      <div class="publicCatalog_type">
        <v-icon>{{ ICON.QUESTION_OUTLINE }}</v-icon>
        {{ publicCatalog.elementsInCatalogCount ?? 0 }} {{ $t('questionsInGame') }}
      </div>
      <div class="publicCatalog_showMore">
        <span>{{ $t('showDetails') }}</span>
        <v-icon>{{ ICON.MINI_ARROW_RIGHT }}</v-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .publicCatalogs {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
    overflow-y: scroll;
    width: 100%;

    .publicCatalog {
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      border-radius: 12px;
      background-color: $background;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;

      &_title {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: $mainBrownColor;
        color: $whiteColor;
        padding: 4px 12px;
        font-size: 12px;
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

      &_img {
        padding: 12px 12px 0 12px;
        img {
          max-width: 100%;
          border: 1px solid $lightBrownColor;
          border-radius: 6px;
        }
      }

      &_type {
        font-size: 12px;
        padding: 0 14px;
        color: $mainBrownColor;
        margin: 2px 0;
      }

      &_showMore {
        font-size: 14px;
        font-weight: 600;
        color: $mainBrownColor;
        letter-spacing: -0.8px;
        display: flex;
        justify-content: end;
        padding: 0 4px 4px 8px;
      }
    }
  }
</style>
