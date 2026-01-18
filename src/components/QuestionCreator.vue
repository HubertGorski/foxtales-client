<script setup lang="ts">
  import type { Catalog } from '@/models/Catalog';
  import WhiteCard from './WhiteCard.vue';
  import { computed, ref, watch, type PropType } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import HubBtn from './hubComponents/HubBtn.vue';
  import WhiteSelectList from './selectLists/WhiteSelectList.vue';
  import { convertCatalogsToListElement, ListElement } from './selectLists/ListElement';

  const userStore = useUserStore();

  const props = defineProps({
    newQuestion: {
      type: String,
      required: false,
    },
    isQuestionCreatorOpen: {
      type: Boolean,
      required: true,
    },
    addMany: {
      type: Boolean,
    },
    selectedCatalogsIds: {
      type: Array as PropType<Array<number>>,
    },
  });

  const emit = defineEmits<{
    (e: 'addQuestion', catalogs: Catalog[]): void;
  }>();

  const actualCatalogs = ref<ListElement[]>(
    userStore.user.catalogs.map(convertCatalogsToListElement)
  );

  watch(
    () => userStore.user.catalogs,
    newCatalogs => {
      actualCatalogs.value = newCatalogs.map(convertCatalogsToListElement);
    },
    { deep: true }
  );

  watch(
    () => props.isQuestionCreatorOpen,
    isOpen => {
      if (!isOpen) {
        actualCatalogs.value.forEach(catalog => (catalog.isSelected = false));
      } else {
        actualCatalogs.value.forEach(
          catalog => (catalog.isSelected = props.selectedCatalogsIds?.includes(catalog.id) ?? false)
        );
      }
    }
  );

  const addQuestion = () => {
    const selectedActualCatalogIds = new Set(
      actualCatalogs.value.filter(catalog => catalog.isSelected).map(c => c.id)
    );

    const selectedUserCatalogs = userStore.user.catalogs.filter(
      catalog => catalog.catalogId != null && selectedActualCatalogIds.has(catalog.catalogId)
    );

    actualCatalogs.value = userStore.user.catalogs.map(convertCatalogsToListElement);

    emit('addQuestion', selectedUserCatalogs);
  };

  const addQuestionBtn = computed(() => ({
    text: props.newQuestion ? 'add' : 'accept',
    isOrange: true,
    action: addQuestion,
  }));
</script>

<template>
  <div class="questionCreator creamCard">
    <div class="questionCreator_title">{{ $t('psych.addToCatalog') }}</div>
    <WhiteCard v-if="!addMany && newQuestion" :header="$t('psych.createdQuestion')">
      <div class="question">
        {{ newQuestion }}
      </div>
    </WhiteCard>
    <WhiteSelectList
      v-model="actualCatalogs"
      emptyDataText="psych.noDirectoryHasBeenCreatedYet"
      customSelectedCountTitle="selectedCatalogs"
      :height="198"
      showSelectedCount
      multiple
      showPagination
    />
    <HubBtn
      class="questionCreator_btn"
      :action="addQuestionBtn.action"
      :text="addQuestionBtn.text"
      :isOrange="addQuestionBtn.isOrange"
      :disabled="addQuestionBtn.disabled"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .questionCreator {
    width: 324px;
    padding: 12px;

    &_title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
    }

    .question {
      font-size: 14px;
      font-style: italic;
      color: $lightGrayColor;
      letter-spacing: 0.5px;
    }

    &_btn {
      padding: 8px;
      margin-top: 16px;
    }
  }
</style>
