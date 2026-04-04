<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import HubPopup from './hubComponents/HubPopup.vue';
  import HubBtn from './hubComponents/HubBtn.vue';
  import HubTooltip from './hubComponents/HubTooltip.vue';
  import { useUserStore } from '@/stores/userStore';
  import { ICON } from '@/enums/iconsEnum';
  import { Catalog } from '@/models/Catalog';
  import { useRoute, useRouter } from 'vue-router';
  import { psychService } from '@/api/services/PsychService';
  import { useLoading } from '@/composables/useLoading';

  const props = defineProps<{
    refreshListAction?: (tabName?: string) => void;
  }>();

  const isVisible = ref<boolean>(false);
  const catalog = ref<Catalog | null>(null);

  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();
  const { withLoading } = useLoading();

  const isOwner = computed(() => {
    return catalog.value?.ownerId === userStore.user.userId;
  });

  const isAlreadyInCollection = computed(() => {
    return userStore.user.receivedCatalogs.some(c => c.catalogId === catalog.value?.catalogId);
  });

  const isButtonDisabled = computed(() => isOwner.value || isAlreadyInCollection.value);

  const tooltipMessage = computed(() => {
    if (isOwner.value) return 'catalog.ownerLibraryWarning';
    if (isAlreadyInCollection.value) return 'catalog.alreadyInLibraryWarning';
    return '';
  });

  const goBack = () => {
    isVisible.value = false;
    router.replace({ query: { ...route.query, cat: undefined } });
  };

  const confirm = async () => {
    if (!catalog.value?.catalogId) return;

    await withLoading(async () => {
      try {
        if (catalog.value) {
          await psychService.addCatalogFollower(
            catalog.value.shareKey ?? '',
            userStore.user.userId
          );
          userStore.addReceivedCatalog(catalog.value);
          props.refreshListAction?.('receivedCatalogs');
          goBack();
        }
      } catch (error) {
        console.error('Failed to add shared catalog to library:', error);
      }
    });
  };

  const loadSharedCatalog = async (shareKey: string) => {
    await withLoading(async () => {
      try {
        const fetchedCatalog = await psychService.getCatalogForShare(shareKey);
        if (fetchedCatalog) {
          catalog.value = fetchedCatalog;
          isVisible.value = true;
        }
      } catch (error) {
        console.error('Failed to load shared catalog:', error);
      }
    });
  };

  onMounted(() => {
    const shareKey = route.query.cat as string;
    if (shareKey) {
      loadSharedCatalog(shareKey);
    }
  });
</script>

<template>
  <div class="catalogByShareKeyPopup">
    <HubPopup v-model="isVisible">
      <div v-if="catalog" class="catalogByShareKeyPopup_card">
        <div class="catalogByShareKeyPopup_content">
          <div class="catalogByShareKeyPopup_title">
            {{ catalog.title }}
          </div>
          <div v-if="catalog.author" class="catalogByShareKeyPopup_author">
            {{ $t('catalog.author') }}:
            <span>{{ catalog.author }}</span>
          </div>
          <div class="catalogByShareKeyPopup_body">
            <div v-if="catalog.description" class="catalogByShareKeyPopup_section">
              <div class="catalogByShareKeyPopup_sectionTitle">
                <v-icon>{{ ICON.INFO }}</v-icon>
                {{ $t('description') }}
              </div>
              <p class="catalogByShareKeyPopup_description">
                {{ catalog.description }}
              </p>
            </div>
            <div class="catalogByShareKeyPopup_section">
              <div class="catalogByShareKeyPopup_sectionTitle">
                <v-icon>{{ ICON.QUESTION_OUTLINE }}</v-icon>
                <span>{{ $t('questions') }}</span>
                <span class="catalogByShareKeyPopup_questionsBadge">
                  {{ catalog.questionsInCatalogCount ?? 0 }}
                </span>
              </div>
              <div class="catalogByShareKeyPopup_questions">
                <span v-for="question in catalog.questions" :key="question.text" class="infoBlock">
                  „{{ question.text }}"
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="catalogByShareKeyPopup_footer">
          <HubBtn text="back" :action="goBack" ghost small />
          <span class="catalogByShareKeyPopup_footerTitle">{{ catalog.title }}</span>
          <HubTooltip :tooltipText="tooltipMessage" :tooltipDisabled="!isButtonDisabled">
            <HubBtn
              text="addToLibrary"
              :action="confirm"
              :disabled="isButtonDisabled"
              isOrange
              small
            />
          </HubTooltip>
        </div>
      </div>
    </HubPopup>
  </div>
</template>

<style lang="scss">
  @use '@/assets/styles/variables' as *;

  .catalogByShareKeyPopup {
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

    &_footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: $lightBrownColor;
      gap: 8px;
    }

    &_footerTitle {
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

    &_title {
      font-size: 20px;
      font-weight: 700;
      color: $mainBrownColor;
      text-align: center;
      letter-spacing: -0.5px;
      padding: 16px 20px 4px;
    }

    &_author {
      font-size: 14px;
      font-style: italic;
      color: $grayColor;
      text-align: center;
      padding-bottom: 8px;

      span {
        color: $mainOrangeColor;
        font-weight: 700;
        font-style: normal;
      }
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
  }
</style>
