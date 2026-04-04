<script setup lang="ts">
  import { computed, ref } from 'vue';
  import HubInputWithBtn from '@/components/hubComponents/HubInputWithBtn.vue';
  import HubPopup from '@/components/hubComponents/HubPopup.vue';
  import QuestionCreator from '@/components/QuestionCreator.vue';
  import HubAccordion from '@/components/hubComponents/HubAccordion.vue';
  import HubAccordionElement from '@/components/hubComponents/HubAccordionElement.vue';
  import { Catalog } from '@/models/Catalog';
  import { ICON } from '@/enums/iconsEnum';
  import CatalogCreator from '@/components/CatalogCreator.vue';
  import { useUserStore } from '@/stores/userStore';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import WhiteSelectList from '@/components/selectLists/WhiteSelectList.vue';
  import {
    convertCatalogsToListElement,
    convertQuestionToListElement,
    ListElement,
  } from '@/components/selectLists/ListElement';
  import ScrollSelectList from '@/components/selectLists/ScrollSelectList.vue';
  import { Question } from '@/models/Question';
  import HubDialogPopup from '@/components/hubComponents/HubDialogPopup.vue';
  import { psychService } from '@/api/services/PsychService';
  import HubDivider from '@/components/hubComponents/HubDivider.vue';
  import { useI18n } from 'vue-i18n';
  import { useLoading } from '@/composables/useLoading';
  import ShowMemoryPopup from '@/components/psychGame/ShowMemoryPopup.vue';
  import CatalogByShareKeyPopup from '@/components/CatalogByShareKeyPopup.vue';

  const userStore = useUserStore();
  const { t } = useI18n();

  const addQuestion = async (catalogs: Catalog[], fromDashboard: boolean = false) =>
    withLoading(async () => {
      event?.preventDefault();
      if (addManyQuestonsToCatalogs.value && catalogs != null && catalogs.length) {
        return assignedQuestionsToCatalogs(catalogs);
      }

      if (!fromDashboard) {
        actualSelectedCatalogs.value = catalogs;
      }

      if (!newQuestion.value) {
        isQuestionCreatorOpen.value = false;
        return;
      }

      const questionToStore = new Question(null, userStore.user.userId);
      questionToStore.text = newQuestion.value;

      let catalogIds: number[] = [];
      if (actualSelectedCatalogs.value && actualSelectedCatalogs.value.length > 0) {
        catalogIds = actualSelectedCatalogs.value
          .map(catalog => catalog.catalogId)
          .filter((id): id is number => id !== null);
        questionToStore.addCatalogs(catalogIds);
      }

      const response = await psychService.addQuestion(questionToStore);
      if (!response.questionId) {
        return;
      }

      questionToStore.id = response.questionId;
      questionToStore.translations = response.translations;
      userStore.addQuestion(questionToStore);
      if (catalogIds.length) {
        userStore.assignedQuestionsToCatalogs([response.questionId], catalogIds);
        refreshCatalogList();
      }

      isQuestionCreatorOpen.value = false;
      newQuestion.value = '';
      refreshQuestionsList();
    });

  const deleteQuestions = async (questions: ListElement[]) => {
    const questionsIds = questions.map(question => question.id);
    const response = await psychService.removeQuestions(questionsIds);
    if (!response) {
      return;
    }

    questionsIds.forEach(questionId => {
      userStore.removeQuestion(questionId);
    });
    refreshCatalogList();
    refreshQuestionsList();
  };

  const assignedQuestionsToCatalogs = async (catalogs: Catalog[]) => {
    const selectedActualQuestionsIds = questionsToSelect.value.map(question => question.id);
    const selectedActualCatalogsIds = catalogs
      .map(catalog => catalog.catalogId)
      .filter(catalogId => catalogId !== null);

    const response = await psychService.assignedQuestionsToCatalogs(
      selectedActualQuestionsIds,
      selectedActualCatalogsIds
    );

    if (!response) {
      return;
    }

    userStore.assignedQuestionsToCatalogs(selectedActualQuestionsIds, selectedActualCatalogsIds);

    refreshCatalogList();
    isQuestionCreatorOpen.value = false;
    addManyQuestonsToCatalogs.value = false;
    questionsToSelect.value = [];
    actualQuestions.value.forEach(question => (question.isSelected = false));
  };

  const addNewCatalog = () => {
    editCatalogMode.value = false;
    isCatalogCreatorOpen.value = true;
    currentCatalog.value = new Catalog();
    isReadCatalogMode.value = false;
  };

  const addQuestionsToCatalog = (questions: ListElement[]) => {
    addManyQuestonsToCatalogs.value = true;
    isQuestionCreatorOpen.value = true;
    questionsToSelect.value = questions;
    const selectedQuestions = questionsToSelect.value.filter(question => question.isSelected);

    if (selectedQuestions.length === 1) {
      const question = userStore.user.questions.find(q => q.id === questionsToSelect.value[0].id);
      catalogsIdsFromSelectedQuestion.value = question?.catalogIds ?? [];
    } else {
      catalogsIdsFromSelectedQuestion.value = [];
    }
  };

  const showCatalogsList = () => {
    catalogsIdsFromSelectedQuestion.value = [];
    addManyQuestonsToCatalogs.value = false;
    isQuestionCreatorOpen.value = true;
  };

  const isReadCatalogMode = ref(false);
  const showCatalogDetails = (catalog: ListElement) => {
    const isReceived = userStore.user.receivedCatalogs.some(c => c.catalogId === catalog.id);

    currentCatalog.value = [...userStore.user.catalogs, ...userStore.user.receivedCatalogs].find(
      actualCatalog => actualCatalog.catalogId === catalog.id
    )!;

    if (isReceived) {
      isReadCatalogMode.value = true;
      editCatalogMode.value = false;
      isCatalogCreatorOpen.value = true;
    } else {
      isReadCatalogMode.value = false;
      editCatalogMode.value = true;
      isCatalogCreatorOpen.value = true;
    }
  };

  const closePopup = (refresh: boolean = false) => {
    isCatalogCreatorOpen.value = false;

    if (refresh) {
      const tab = isReadCatalogMode.value ? 'receivedCatalogs' : 'yourCatalogs';
      refreshCatalogList(tab);
    }
  };

  const refreshCatalogList = (tabName?: string) => {
    actualCatalogs.value = userStore.user.catalogs
      .map(convertCatalogsToListElement)
      .sort((a, b) => b.id - a.id);
    actualReceivedCatalogs.value = userStore.user.receivedCatalogs
      .map(convertCatalogsToListElement)
      .sort((a, b) => b.id - a.id);

    if (tabName) {
      setOpenTab.value = tabName;
    }
  };

  const refreshQuestionsList = () => {
    actualQuestions.value = userStore.user.questions
      .map(convertQuestionToListElement)
      .sort((a, b) => b.id - a.id);
    setOpenTab.value = 'addQuestion';
  };

  const showDeleteCatalogPopup = (catalogId: number) => {
    isCatalogCreatorOpen.value = false;
    isDeletePopupOpen.value = true;
    catalogIdToRemove = catalogId;
  };

  const showAbandonCatalogPopup = (catalogId: number) => {
    isCatalogCreatorOpen.value = false;
    isAbandonPopupOpen.value = true;
    catalogIdToAbandon = catalogId;
  };

  const deleteCatalog = async () => {
    if (!catalogIdToRemove) {
      return;
    }

    isDeletePopupOpen.value = false;
    const response = await psychService.removeCatalog(catalogIdToRemove);
    if (!response) {
      return;
    }

    userStore.removeCatalog(catalogIdToRemove);
    actualSelectedCatalogs.value = actualSelectedCatalogs.value.filter(
      catalog => catalog.catalogId !== catalogIdToRemove
    );

    refreshCatalogList();
  };

  const abandonCatalog = async () => {
    if (!catalogIdToAbandon) {
      return;
    }

    isAbandonPopupOpen.value = false;
    const response = await psychService.removeCatalogFollower(
      catalogIdToAbandon,
      userStore.user.userId
    );

    if (!response) {
      return;
    }

    userStore.removeReceivedCatalog(catalogIdToAbandon);
    refreshCatalogList();
  };

  const showRemoveFollowerPopup = (userId: number) => {
    isCatalogCreatorOpen.value = false;
    isRemoveFollowerPopupOpen.value = true;
    userIdToRemove = userId;
  };

  const removeFollower = async () => {
    if (!userIdToRemove || !currentCatalog.value.catalogId) {
      return;
    }

    isRemoveFollowerPopupOpen.value = false;
    await psychService.removeCatalogFollower(currentCatalog.value.catalogId, userIdToRemove);

    if (currentCatalog.value.followers) {
      currentCatalog.value.followers = currentCatalog.value.followers.filter(
        f => f.userId !== userIdToRemove
      );
    }

    userIdToRemove = null;
    isCatalogCreatorOpen.value = true;
  };

  let catalogIdToRemove: number | null = null;
  let catalogIdToAbandon: number | null = null;
  let userIdToRemove: number | null = null;
  const isDeletePopupOpen = ref<boolean>(false);
  const isAbandonPopupOpen = ref<boolean>(false);
  const isRemoveFollowerPopupOpen = ref<boolean>(false);
  const isCatalogCreatorOpen = ref<boolean>(false);
  const isQuestionCreatorOpen = ref<boolean>(false);
  const isMemoriesPopupAvailable = ref<boolean>(false);
  const setOpenTab = ref<string>('addQuestion');
  const newQuestion = ref<string>('');
  const currentCatalog = ref<Catalog>(new Catalog());
  const editCatalogMode = ref<boolean>(false);
  const addManyQuestonsToCatalogs = ref<boolean>(false);
  const questionRef = ref<HTMLElement | null>(null);
  const actualQuestions = ref<ListElement[]>(
    userStore.user.questions.map(convertQuestionToListElement).sort((a, b) => b.id - a.id)
  );
  const questionsToSelect = ref<ListElement[]>([]);
  const catalogsIdsFromSelectedQuestion = ref<number[]>([]);
  const actualCatalogs = ref<ListElement[]>(
    userStore.user.catalogs.map(convertCatalogsToListElement).sort((a, b) => b.id - a.id)
  );
  const actualReceivedCatalogs = ref<ListElement[]>(
    userStore.user.receivedCatalogs.map(convertCatalogsToListElement).sort((a, b) => b.id - a.id)
  );

  const actualSelectedCatalogs = ref<Catalog[]>([]);

  const { loading: isBtnLoading, withLoading } = useLoading();

  const addQuestionBtn = computed(() => {
    return {
      text: 'add',
      isOrange: true,
      action: () => addQuestion([], true),
      loading: isBtnLoading.value,
      disabled: !newQuestion.value.trim() || isBtnLoading.value,
    };
  });

  const selectedCatalogsNames = computed((): string => {
    return (actualSelectedCatalogs.value ?? []).map(c => `"${c.title}"`).join(', ');
  });

  const selectedCatalogsInfoText = computed((): string => {
    return selectedCatalogsNames.value
      ? `${t('selectedCatalogInfoText')} ${selectedCatalogsNames.value}`
      : t('beforeSelectedCatalogInfoText');
  });

  const scrollToInput = () => {
    setTimeout(() => {
      questionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  //TODO: jak jest jedno pytanie zaznaczone to dac mozliwosc wypisywania go z katalogu.
</script>

<template>
  <div class="libraryView">
    <div class="libraryView_content">
      <HubAccordionElement
        title="yourMemory"
        isSmallerTitle
        @click="isMemoriesPopupAvailable = true"
      />
      <HubAccordionElement title="addCatalog" isSmallerTitle @click="addNewCatalog" />
      <HubAccordion
        v-model="setOpenTab"
        :slotNames="[
          { slotName: 'yourCatalogs', isComing: false, darkBackground: false },
          { slotName: 'receivedCatalogs', isComing: false, darkBackground: false },
          { slotName: 'addQuestion', isComing: false, darkBackground: false },
          { slotName: 'yourQuestions', isComing: false, darkBackground: true },
        ]"
        isSmallerTitle
      >
        <template #yourCatalogs>
          <WhiteSelectList
            v-model="actualCatalogs"
            class="yourCatalogs"
            :height="146"
            :itemsPerPage="3"
            :fontSize="14"
            emptyDataText="psych.noDirectoryHasBeenCreatedYet"
            multiple
            showPagination
            showItemDetailsBtn
            @showDetails="showCatalogDetails"
          />
        </template>
        <template #receivedCatalogs>
          <WhiteSelectList
            v-model="actualReceivedCatalogs"
            class="yourCatalogs"
            :height="146"
            :itemsPerPage="3"
            :fontSize="14"
            emptyDataText="psych.noReceivedCatalogsYet"
            multiple
            showPagination
            showItemDetailsBtn
            :itemDetailsIcon="ICON.VIEW_DETAILS"
            @showDetails="showCatalogDetails"
          />
        </template>
        <template #addQuestion>
          <div ref="questionRef" class="selectedCatalogs">{{ selectedCatalogsInfoText }}</div>
          <HubDivider />
          <HubInputWithBtn
            v-model="newQuestion"
            class="addQuestionToLibrary"
            :btnAction="addQuestionBtn.action"
            :btnLoading="addQuestionBtn.loading"
            :btnIsDisabled="addQuestionBtn.disabled"
            :inputDisabled="isBtnLoading"
            :btnText="addQuestionBtn.text"
            :extraBtnIcon="ICON.ADD_TO_COLLECTION"
            :extraBtnAction="showCatalogsList"
            :btnIsOrange="addQuestionBtn.isOrange"
            textPlaceholder="exampleQuestion"
            isTextarea
            @focus="scrollToInput"
          >
            <div class="addQuestionTutorial">
              {{ $t('questionTutorial') }}
            </div>
          </HubInputWithBtn>
        </template>
        <template #yourQuestions>
          <ScrollSelectList
            v-model="actualQuestions"
            addCutomText="psych.addToCatalog"
            emptyDataText="psych.noQuestionsHasBeenCreatedYet"
            @addItems="addQuestionsToCatalog"
            @deleteItems="deleteQuestions"
          />
        </template>
      </HubAccordion>
    </div>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />

    <!-- POPUPS -->
    <HubDialogPopup
      v-model="isDeletePopupOpen"
      :textPopup="$t('confirmDeleteCatalogTextPopup')"
      :confirmAction="() => deleteCatalog()"
    />
    <ShowMemoryPopup v-model="isMemoriesPopupAvailable" />
    <HubPopup v-model="isQuestionCreatorOpen">
      <QuestionCreator
        :newQuestion="newQuestion"
        :isQuestionCreatorOpen="isQuestionCreatorOpen"
        :addMany="addManyQuestonsToCatalogs"
        :selectedCatalogsIds="catalogsIdsFromSelectedQuestion"
        @addQuestion="addQuestion"
      />
    </HubPopup>
    <HubPopup v-model="isCatalogCreatorOpen">
      <CatalogCreator
        v-model="currentCatalog"
        :editMode="editCatalogMode"
        :readMode="isReadCatalogMode"
        @closePopup="closePopup"
        @showDeleteCatalogPopup="showDeleteCatalogPopup"
        @showAbandonCatalogPopup="showAbandonCatalogPopup"
        @showRemoveFollowerPopup="showRemoveFollowerPopup"
      />
    </HubPopup>
    <HubDialogPopup
      v-model="isRemoveFollowerPopupOpen"
      :titlePopup="$t('confirmRemoveFollowerTitle')"
      :textPopup="$t('confirmRemoveFollowerSubtitle')"
      :confirmAction="() => removeFollower()"
      :backAction="() => (isCatalogCreatorOpen = true)"
    />
    <HubDialogPopup
      v-model="isAbandonPopupOpen"
      :textPopup="$t('confirmAbandonCatalogTextPopup')"
      :confirmAction="() => abandonCatalog()"
    />
    <CatalogByShareKeyPopup :refreshListAction="refreshCatalogList" />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .libraryView {
    background: $mainBackground;
    height: 100%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &_content {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
      gap: 12px;
      margin-bottom: 12px;

      .yourCatalogs {
        padding: 8px;
      }

      .addQuestionToLibrary {
        padding: 12px;
      }

      .selectedCatalogs {
        margin: 8px 12px 0 12px;
        font-style: italic;
        color: $mainBrownColor;
        overflow-x: scroll;
        text-align: center;
        white-space: nowrap;
      }

      .addQuestionTutorial {
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        padding: 4px 4px 0 4px;
      }
    }
  }
</style>
