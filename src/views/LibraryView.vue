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
  import { useViewStore } from '@/stores/viewStore';

  const userStore = useUserStore();

  const addQuestion = async (catalogs: Catalog[]) => {
    event?.preventDefault();
    if (addManyQuestonsToCatalogs.value && catalogs != null && catalogs.length) {
      return assignedQuestionsToCatalogs(catalogs);
    }

    const questionToStore = new Question(
      null,
      newQuestion.value,
      userStore.user.userId,
      userStore.user.language
    );

    let catalogIds: number[] = [];
    if (catalogs && catalogs.length > 0) {
      catalogIds = catalogs
        .map(catalog => catalog.catalogId)
        .filter((id): id is number => id !== null);
      questionToStore.addCatalogs(catalogIds);
    }

    const response = await psychService.addQuestion(questionToStore);
    if (!response) {
      return;
    }

    questionToStore.id = response;
    userStore.addQuestion(questionToStore);
    if (catalogIds.length) {
      userStore.assignedQuestionsToCatalogs([response], catalogIds);
      refreshCatalogList();
    }

    isQuestionCreatorOpen.value = false;
    newQuestion.value = '';
    refreshQuestionsList();
  };

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

  const showCatalogDetails = (catalog: ListElement) => {
    currentCatalog.value = userStore.user.catalogs.find(
      actualCatalog => actualCatalog.catalogId === catalog.id
    )!;
    editCatalogMode.value = true;
    isCatalogCreatorOpen.value = true;
  };

  const closePopup = (refresh: boolean = false) => {
    isCatalogCreatorOpen.value = false;

    if (refresh) {
      refreshCatalogList();
    }
  };

  const refreshCatalogList = () => {
    actualCatalogs.value = userStore.user.catalogs.map(convertCatalogsToListElement);
    setOpenTab.value = 'addQuestion';
  };

  const refreshQuestionsList = () => {
    actualQuestions.value = userStore.user.questions.map(convertQuestionToListElement);
    setOpenTab.value = 'addQuestion';
  };

  const showDeleteCatalogPopup = (catalogId: number) => {
    isCatalogCreatorOpen.value = false;
    isDeletePopupOpen.value = true;
    catalogIdToRemove = catalogId;
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
    refreshCatalogList();
  };

  let catalogIdToRemove: number | null = null;
  const isDeletePopupOpen = ref<boolean>(false);
  const isCatalogCreatorOpen = ref<boolean>(false);
  const isQuestionCreatorOpen = ref<boolean>(false);
  const setOpenTab = ref<string>('addQuestion');
  const newQuestion = ref<string>('');
  const currentCatalog = ref<Catalog>(new Catalog());
  const editCatalogMode = ref<boolean>(true);
  const addManyQuestonsToCatalogs = ref<boolean>(false);
  const actualQuestions = ref<ListElement[]>(
    userStore.user.questions.map(convertQuestionToListElement)
  );
  const questionsToSelect = ref<ListElement[]>([]);
  const catalogsIdsFromSelectedQuestion = ref<number[]>([]);
  const actualCatalogs = ref<ListElement[]>(
    userStore.user.catalogs.map(convertCatalogsToListElement)
  );

  const addQuestionBtn = computed(() => {
    return {
      text: 'add',
      isOrange: true,
      action: addQuestion,
      disabled: !newQuestion.value.trim(),
    };
  });

  const isKeyboardOpen = computed(() => {
    return useViewStore().getIsKeyboardOpen();
  });

  //TODO: jak jest jedno pytanie zaznaczone to dac mozliwosc wypisywania go z katalogu.
</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isQuestionCreatorOpen">
      <QuestionCreator
        :newQuestion="newQuestion"
        @addQuestion="addQuestion"
        :isQuestionCreatorOpen="isQuestionCreatorOpen"
        :addMany="addManyQuestonsToCatalogs"
        :selectedCatalogsIds="catalogsIdsFromSelectedQuestion"
      />
    </HubPopup>
    <HubPopup v-model="isCatalogCreatorOpen">
      <CatalogCreator
        v-model="currentCatalog"
        :editMode="editCatalogMode"
        @closePopup="closePopup"
        @showDeleteCatalogPopup="showDeleteCatalogPopup"
      />
    </HubPopup>
    <HubAccordionElement @click="addNewCatalog" title="addCatalog" isSmallerTitle />
    <HubAccordion
      v-model="setOpenTab"
      :slotNames="[
        { slotName: 'yourCatalogs', isComing: false },
        { slotName: 'addQuestion', isComing: false },
      ]"
      isSmallerTitle
    >
      <template #yourCatalogs>
        <WhiteSelectList
          class="yourCatalogs"
          v-model="actualCatalogs"
          :height="146"
          :itemsPerPage="3"
          :fontSize="14"
          emptyDataText="psych.noDirectoryHasBeenCreatedYet"
          multiple
          showPagination
          showElementsCountInItem
          showItemDetailsBtn
          @showDetails="showCatalogDetails"
        />
      </template>
      <template #addQuestion>
        <HubInputWithBtn
          v-model="newQuestion"
          class="addQuestionToLibrary"
          :btnAction="addQuestionBtn.action"
          :btnIsDisabled="addQuestionBtn.disabled"
          :btnText="addQuestionBtn.text"
          :extraBtnIcon="ICON.ADD_TO_COLLECTION"
          :extraBtnAction="showCatalogsList"
          :btnIsOrange="addQuestionBtn.isOrange"
          textPlaceholder="exampleQuestion"
          isTextarea
        >
          <div class="addQuestionTutorial">
            {{ $t('questionTutorial') }}
          </div>
        </HubInputWithBtn>
      </template>
    </HubAccordion>
    <HubAccordionElement
      @click="setOpenTab = ''"
      class="manageLibrary"
      :class="{
        isHidden: setOpenTab === 'addQuestion' && isKeyboardOpen,
      }"
      title="yourQuestions"
      :isOpen="setOpenTab != 'addQuestion' || !isKeyboardOpen"
      isSmallerTitle
      centerContent
    >
      <ScrollSelectList
        v-model="actualQuestions"
        addCutomText="psych.addToCatalog"
        emptyDataText="psych.noQuestionsHasBeenCreatedYet"
        @addItems="addQuestionsToCatalog"
        @deleteItems="deleteQuestions"
      />
    </HubAccordionElement>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />
    <HubDialogPopup
      v-model="isDeletePopupOpen"
      :textPopup="$t('confirmDeleteCatalogTextPopup')"
      :confirmAction="() => deleteCatalog()"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .libraryView {
    background: $mainBackground;
    height: 100%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .yourCatalogs {
      padding: 8px;
    }

    .addQuestionToLibrary {
      padding: 12px;
    }

    .addQuestionTutorial {
      font-size: 14px;
      font-style: italic;
      color: $lightGrayColor;
      padding: 4px 4px 0 4px;
    }

    .manageLibrary {
      flex-grow: 1;

      &.isHidden {
        flex-grow: 0;
      }
    }
  }
</style>
