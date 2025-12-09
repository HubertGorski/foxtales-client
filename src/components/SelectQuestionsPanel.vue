<script setup lang="ts">
  import HubSwitch from './hubComponents/HubSwitch.vue';
  import HubSwitchBtns, { type HubSwitchBtnsItem } from './hubComponents/HubSwitchBtns.vue';
  import WhiteSelectList from './selectLists/WhiteSelectList.vue';
  import { computed, ref, watch } from 'vue';
  import { convertCatalogsToListElement, type ListElement } from './selectLists/ListElement';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/stores/userStore';
  import type { Question } from '@/models/Question';
  import { QUESTION_SOURCE } from '@/enums/questionSource';

  export interface SelectedQuestions {
    source: QUESTION_SOURCE;
    questions: Question[];
    chosenCatalogId: number | undefined;
  }

  const emit = defineEmits<{
    (e: 'setQuestions', questions: SelectedQuestions): void;
  }>();

  const { t } = useI18n();
  const userStore = useUserStore();

  const usePrivateQuestions = defineModel('usePrivateQuestions', {
    type: Boolean,
    required: true,
  });
  const catalogs = ref<ListElement[]>(userStore.user.catalogs.map(convertCatalogsToListElement));

  const privateQuestionsSelectedOptions: HubSwitchBtnsItem[] = [
    { id: QUESTION_SOURCE.ALL_QUESTIONS, title: t('lobby.allQuestions') },
    { id: QUESTION_SOURCE.SELECTED_CATALOG, title: t('lobby.selectedCatalog') },
  ];

  const selectedPrivateQuestionsSelectedOption = ref<HubSwitchBtnsItem>(
    privateQuestionsSelectedOptions.find(q => q.id === userStore.user.chosenQuestionsSource) ??
      privateQuestionsSelectedOptions[0]
  );

  const questions = computed(() => {
    if (!usePrivateQuestions.value) {
      return [];
    }

    if (selectedPrivateQuestionsSelectedOption.value?.id === QUESTION_SOURCE.ALL_QUESTIONS) {
      return userStore.user.questions;
    }

    const selectedCatalogId = catalogs.value.find(catalog => catalog.isSelected)?.id ?? 0;

    const selectedCatalog = userStore.user.catalogs.find(
      catalog => catalog.catalogId && catalog.catalogId === selectedCatalogId
    );

    if (selectedCatalog) {
      return selectedCatalog.questions;
    }

    return [];
  });

  watch(questions, () => {
    emit('setQuestions', {
      source: selectedPrivateQuestionsSelectedOption.value?.id,
      questions: questions.value,
      chosenCatalogId: catalogs.value.find(c => c.isSelected)?.id,
    });
  });
</script>

<template>
  <div class="selectQuestionsPanel">
    <HubSwitch
      v-model="usePrivateQuestions"
      label="lobby.usePrivateQuestions"
      tooltipText="tooltip.privateQuestionsDescription"
      withIcon
    />
    <div v-if="usePrivateQuestions" class="selectQuestionsPanel_selectOptions">
      <HubSwitchBtns
        v-model="selectedPrivateQuestionsSelectedOption"
        :items="privateQuestionsSelectedOptions"
        :fontSize="14"
      />
      <WhiteSelectList
        v-if="selectedPrivateQuestionsSelectedOption.id == QUESTION_SOURCE.SELECTED_CATALOG"
        v-model="catalogs"
        :itemsPerPage="1"
        emptyDataText="psych.noDirectoryHasBeenCreatedYet"
        :selectItemId="userStore.user.chosenCatalogId"
        showPagination
        selectVisibleItems
        moveToSelectedItem
        minimalView
        infinityPages
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  .selectQuestionsPanel {
    min-width: 284px;

    &_selectOptions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 16px;
    }
  }
</style>
