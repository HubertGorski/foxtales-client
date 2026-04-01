<script setup lang="ts">
  import { Catalog } from '@/models/Catalog';
  import WhiteSelectList from './selectLists/WhiteSelectList.vue';
  import { useUserStore } from '@/stores/userStore';
  import { computed, ref, watch } from 'vue';
  import { ICON } from '@/enums/iconsEnum';
  import { convertQuestionToListElement, ListElement } from './selectLists/ListElement';
  import HubBtn from './hubComponents/HubBtn.vue';
  import type { CatalogType } from '@/models/CatalogType';
  import { psychService } from '@/api/services/PsychService';
  import { useLoading } from '@/composables/useLoading';
  import HubInput from './hubComponents/HubInput.vue';
  import { useI18n } from 'vue-i18n';
  import CatalogFollowers from './CatalogFollowers.vue';
  import CatalogShareLink from './CatalogShareLink.vue';

  const props = defineProps({
    editMode: {
      type: Boolean,
      default: false,
    },
    readMode: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    (e: 'closePopup', refresh: boolean): void;
    (e: 'showDeleteCatalogPopup', catalogId: number): void;
    (e: 'showAbandonCatalogPopup', catalogId: number): void;
  }>();

  const catalog = defineModel({ type: Catalog, required: true });
  const { t } = useI18n();
  const userStore = useUserStore();

  const formErrors = ref<Record<string, string[]>>({});
  const initialTitle = ref(catalog.value.title);
  const initialDescription = ref(catalog.value.description);
  const { loading: isBtnLoading, withLoading } = useLoading();

  const availableTypes: CatalogType[] = catalog.value.availableTypes.length
    ? catalog.value.availableTypes
    : userStore.getAvailableCatalogTypes();

  const hasTitleChanged = computed(() => catalog.value.title !== initialTitle.value);
  const hasDescriptionChanged = computed(
    () => catalog.value.description !== initialDescription.value
  );

  const formBtn = computed(() => {
    return {
      text: props.editMode ? 'accept' : 'add',
      isOrange: true,
      action: props.editMode ? editCatalog : addCatalog,
      disabled: catalog.value.title.length < 3 || !catalog.value.title.trim() || isBtnLoading.value,
    };
  });

  const addCatalog = () =>
    withLoading(async () => {
      formErrors.value = {};
      try {
        addSelectedQuestionsToCatalog();
        catalog.value.availableTypes = availableTypes;
        catalog.value.catalogType = availableTypes[0];
        catalog.value.ownerId = userStore.user.userId;
        const data = await psychService.addCatalog(catalog.value);
        if (!data.catalogId) {
          return;
        }

        catalog.value.translations = data.translations;
        catalog.value.catalogId = data.catalogId;
        userStore.addCatalog(catalog.value);

        const selectedQuestions = actualQuestions.value
          .filter(question => question.isSelected)
          .map(question => question.id);

        const questions = userStore.user.questions.filter(question =>
          selectedQuestions.includes(question.id ?? 0)
        );

        questions.forEach(question => {
          question.catalogIds.push(data.catalogId);
        });

        closePopup();
      } catch (error: any) {
        if (error?.response?.data?.errors) {
          formErrors.value = error.response.data.errors;
        }
      }
    });

  const editCatalog = () =>
    withLoading(async () => {
      formErrors.value = {};
      try {
        addSelectedQuestionsToCatalog();
        const data = await psychService.editCatalog(
          catalog.value,
          hasTitleChanged.value,
          hasDescriptionChanged.value,
          userStore.user.language
        );
        if (!data.catalogId) {
          return;
        }

        catalog.value.translations = data.translations;
        userStore.editCatalog(catalog.value);
        closePopup();
      } catch (error: any) {
        if (error?.response?.data?.errors) {
          formErrors.value = error.response.data.errors;
        }
      }
    });

  const closePopup = (refresh: boolean = true) => {
    clearPopup();
    emit('closePopup', refresh);
  };

  const showDeleteCatalogPopup = (catalogId: number | null) => {
    if (!catalogId) {
      return;
    }

    emit('showDeleteCatalogPopup', catalogId);
  };

  const clearPopup = () => {
    actualQuestions.value = getActualQuestions();
    catalog.value = new Catalog();
  };

  const getActualQuestions = () => {
    if (props.readMode) {
      return catalog.value.questions.map(q => convertQuestionToListElement(q));
    }

    const items = userStore.user.questions.map(convertQuestionToListElement);
    items.forEach(item => {
      if (catalog.value.questions.map(question => question.id).includes(item.id)) {
        item.setSelected();
      }
    });

    return items;
  };

  const addSelectedQuestionsToCatalog = () => {
    const selectedQuestions = actualQuestions.value
      .filter(question => question.isSelected)
      .map(question => question.id);

    const questions = userStore.user.questions.filter(question =>
      selectedQuestions.includes(question.id ?? 0)
    );

    const removedQuestionsIds = initialQuestionsIds.filter(
      id => !questions.map(q => q.id).includes(id)
    );
    catalog.value.setQuestions(questions);
    if (catalog.value.catalogId) {
      userStore.unassignCatalogFromQuestions(removedQuestionsIds, catalog.value.catalogId);
    }

    questions.forEach(question => {
      if (catalog.value.catalogId) {
        question.catalogIds.push(catalog.value.catalogId);
      }
    });
  };

  const actualQuestions = ref<ListElement[]>(getActualQuestions());
  let initialQuestionsIds: (number | null)[] = [];

  const getError = (field: string) => {
    const key = field in formErrors.value ? field : `auth.${field}`;
    const error = formErrors.value[key]?.[0] ?? '';
    return error ? t(`auth.${error}`) : '';
  };

  watch(catalog, () => {
    actualQuestions.value = getActualQuestions();
    initialTitle.value = catalog.value.title;
    initialDescription.value = catalog.value.description;
    if (catalog.value.questions.length) {
      initialQuestionsIds = catalog.value.questions.map(q => q.id).filter(q => q != null);
    }
  });
</script>

<template>
  <div class="catalogCreator creamCard">
    <div class="catalogCreator_title">
      <div v-if="editMode">{{ $t('editCatalog') }}</div>
      <div v-else-if="readMode">{{ catalog.title }}</div>
      <div v-else>{{ $t('createCatalog') }}</div>
      <div class="catalogCreator_controlBtns">
        <v-icon
          v-if="editMode || readMode"
          @click="
            readMode
              ? emit('showAbandonCatalogPopup', catalog.catalogId!)
              : showDeleteCatalogPopup(catalog.catalogId)
          "
        >
          {{ readMode ? ICON.ABANDON : ICON.DELETE }}
        </v-icon>
        <v-icon @click="closePopup(false)">{{ ICON.X }}</v-icon>
      </div>
    </div>
    <div v-if="readMode && catalog.author" class="catalogCreator_author">
      <span>{{ $t('catalog.author') }}:</span>
      <strong>{{ catalog.author }}</strong>
    </div>
    <div v-if="!readMode">
      <HubInput
        v-model="catalog.title"
        :label="$t('title')"
        :errorMessages="getError('Catalog.Translations[0].Title')"
      />
    </div>
    <div v-if="!readMode || catalog.description">
      <HubInput
        v-model="catalog.description"
        :label="$t('description')"
        :textareaRows="2"
        :errorMessages="getError('Catalog.Translations[0].Description')"
        :noResize="false"
        :readonly="readMode"
        isTextarea
      />
    </div>
    <CatalogShareLink
      v-if="!readMode"
      v-model:hasPublicLink="catalog.hasPublicLink"
      v-model:shareKey="catalog.shareKey"
      :catalogId="catalog.catalogId"
    />
    <CatalogFollowers v-if="catalog.catalogId && !readMode" :catalog="catalog" />
    <WhiteSelectList
      v-if="actualQuestions.length"
      v-model="actualQuestions"
      customSelectedCountTitle="selectedQuestionsToCatalog"
      :fontSize="14"
      showSelectedCount
      :multiple="!readMode"
      :readOnly="readMode"
      showPagination
    />
    <HubBtn
      v-if="!readMode"
      class="catalogCreator_btn"
      :action="formBtn.action"
      :text="formBtn.text"
      :disabled="formBtn.disabled"
      :isOrange="formBtn.isOrange"
      :loading="isBtnLoading"
    />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .catalogCreator {
    width: 370px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &_title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
    }

    &_controlBtns {
      display: flex;
      gap: 6px;
    }

    &_author {
      font-size: 14px;
      color: $lightBrownColor;
      margin-top: -14px;
      strong {
        color: $mainOrangeColor;
        margin-left: 4px;
      }
    }

    &_subtitle {
      color: $grayColor;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }

    &_btn {
      padding: 8px;
    }
  }
</style>
