<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue';
  import HubSwitch from '@/components/hubComponents/HubSwitch.vue';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { useSignalRStore } from '@/stores/signalRStore';
  import router from '@/router';
  import { CREATE_GAME, ROUTE_PATH } from '@/router/routeEnums';
  import { Game } from '@/models/Game';
  import SelectQuestionsPanel, {
    type SelectedQuestions,
  } from '@/components/SelectQuestionsPanel.vue';
  import type { Question } from '@/models/Question';
  import { useUserStore } from '@/stores/userStore';
  import WhiteSelectList from '@/components/selectLists/WhiteSelectList.vue';
  import { convertCatalogsToListElement, ListElement } from '@/components/selectLists/ListElement';
  import { RULES, RULES_I18N_KEY } from '@/enums/rulesEnum';
  import { useI18n } from 'vue-i18n';
  import PublicCatalogsList from '@/components/psychGame/PublicCatalogsList.vue';
  import BrownNavigation from '@/components/BrownNavigation.vue';
  import CatalogDetails from '@/components/CatalogDetails.vue';

  const { t } = useI18n();

  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const newGame = ref(signalRStore.game || new Game());
  const currentGame = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const currentQuestions = ref<Question[]>(signalRStore.game?.questions ?? []);
  const isCustomMode = ref<number>(0);
  const publicCatalogs = ref<ListElement[]>(
    userStore.publicCatalogs.map(convertCatalogsToListElement)
  );

  const selectedCatalogId = ref<number | null>(null);

  const gameRules = ref<ListElement[]>([
    new ListElement({
      id: RULES.PSYCH,
      title: t(RULES_I18N_KEY[RULES.PSYCH]),
    }),
    new ListElement({
      id: RULES.DIXIT,
      title: t(RULES_I18N_KEY[RULES.DIXIT]),
    }),
    new ListElement({
      id: RULES.QUIET_DAYS,
      title: t(RULES_I18N_KEY[RULES.QUIET_DAYS]),
    }),
  ]);

  if (!newGame.value.code) {
    router.push(ROUTE_PATH.MENU);
  }

  const leaveRoom = async () => {
    const success = await signalRStore.leaveRoom(userStore.user.userId);
    if (!success) {
      return;
    }

    router.push(ROUTE_PATH.MENU);
  };

  const editRoom = async () => {
    newGame.value.selectedPublicCatalogId =
      publicCatalogs.value.find(catalog => catalog.isSelected)?.id ?? null;
    newGame.value.currentRules = gameRules.value.find(catalog => catalog.isSelected)?.id as RULES;

    let success = await signalRStore.editRoom(newGame.value);
    if (!success) {
      return;
    }

    success = await signalRStore.addPrivateQuestionsToGame(
      userStore.user.userId,
      currentQuestions.value
    );
    if (!success) {
      return;
    }

    router.push(ROUTE_PATH.LOBBY);
  };

  const setCurrentQuestions = async (questions: SelectedQuestions) => {
    currentQuestions.value = currentQuestions.value.filter(
      question => question.isPublic || question.ownerId !== userStore.user.userId
    );

    currentQuestions.value.push(...questions.questions);
    userStore.user.chosenQuestionsSource = questions.source;
    userStore.user.chosenCatalogId = questions.chosenCatalogId;
  };

  const setSelectedCatalogId = (catalogId: number | null): void => {
    selectedCatalogId.value = catalogId;
    const catalogTab = isCustomMode.value ? CREATE_GAME.CUSTOM : CREATE_GAME.PUBLIC;
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        catalog: catalogId ?? catalogTab,
      },
    });
  };

  watch(currentGame, (game: Game | null) => {
    if (game) {
      newGame.value.users = game.users;
      newGame.value.questions = game.questions;
    }
  });
</script>

<template>
  <div class="createGameView">
    <CatalogDetails v-model="selectedCatalogId" @setSelectedCatalogId="setSelectedCatalogId" />
    <div class="createGameView_controlBtns">
      <v-tabs v-model="isCustomMode" @click="() => setSelectedCatalogId(null)">
        <v-tab>{{ $t('list') }}</v-tab>
        <v-tab>{{ $t('createCustom') }}</v-tab>
      </v-tabs>
    </div>
    <PublicCatalogsList
      v-if="!isCustomMode"
      v-model="publicCatalogs"
      :selectedCatalogId="selectedCatalogId"
      @setSelectedCatalogId="setSelectedCatalogId"
    />
    <div v-else class="createGameView_card">
      <div class="creamCard">
        <img src="@/assets/imgs/fox7.webp" alt="Lisek" class="fox" />
        <p class="title">{{ $t('lobby.createGame') }}</p>
        <div class="customGameMode">
          <HubSwitch
            v-model="newGame.usePublicQuestions"
            label="lobby.usePublicQuestions"
            tooltipText="tooltip.publicQuestionsDescription"
            withIcon
          />
          <WhiteSelectList
            v-if="newGame.usePublicQuestions"
            v-model="publicCatalogs"
            :itemsPerPage="1"
            :selectItemId="newGame.selectedPublicCatalogId ?? undefined"
            showPagination
            selectVisibleItems
            moveToSelectedItem
            minimalView
            infinityPages
          />
          <SelectQuestionsPanel
            v-model:usePrivateQuestions="newGame.usePrivateQuestions"
            @setQuestions="setCurrentQuestions"
          />
          <HubSwitch
            v-model="newGame.isQuestionsFromAnotherGamesAllowed"
            label="lobby.isQuestionsFromAnotherGamesAllowed"
          />
          <span class="chooseRules">{{ $t('chooseRulesGame') }}</span>
          <WhiteSelectList
            v-model="gameRules"
            class="rulesGameList"
            :itemsPerPage="1"
            :selectItemId="newGame.currentRules"
            showPagination
            selectVisibleItems
            moveToSelectedItem
            minimalView
            infinityPages
          />
        </div>
        <HubSwitch
          v-model="newGame.isPublic"
          label="lobby.gameVisibleOnList"
          tooltipText="tooltip.roomOnListDescription"
          withIcon
        />
        <div v-if="!newGame.isPublic" class="customCodeSection">
          <p class="customCodeSection_description">
            {{ $t('lobby.inviteOtherPlayers') }}
          </p>
          <p class="customCodeSection_code">{{ newGame.code }}</p>
        </div>
        <div v-else class="publicSection">
          <v-text-field
            v-model="newGame.password"
            class="publicSection_input"
            :label="$t('lobby.entryPassword')"
            type="password"
            outlined
            dense
            hide-details
          />
          <span class="publicSection_info">{{ $t('info.passwordRoom') }}</span>
        </div>
        <NavigationBtns
          btn="closeGame"
          btn2="accept"
          :btnCustomAction="leaveRoom"
          :btn2CustomAction="editRoom"
          btn2isOrange
        />
      </div>
    </div>
    <BrownNavigation
      v-if="!isCustomMode"
      :textBtn="$t('closeGame')"
      :action="leaveRoom"
      :textInfo="$t('lobby.inviteOtherPlayers') + ' ' + newGame.code"
    />
  </div>
</template>

<style lang="scss">
  @import '@/assets/styles/variables';

  .createGameView {
    background: $mainBackground;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    height: 100%;

    &_controlBtns {
      background: $mainBackground;
      width: 100%;
      display: flex;
      justify-content: center;
      z-index: 3;
    }

    .creamCard {
      padding: 14px;
      position: relative;
    }

    &_card {
      padding: 12px 20px;
      width: 100%;
      flex-grow: 1;
      display: flex;
      align-items: center;

      .chooseRules {
        padding-top: 8px;
        color: $grayColor;
      }

      .rulesGameList {
        font-size: 14px;
      }

      .fox {
        position: absolute;
        height: 132px;
        right: 0;
        top: -64px;
        z-index: 4;
      }

      .title {
        color: $grayColor;
        font-size: 24px;
        font-weight: 600;
      }
      .hubSwitch_content {
        max-width: 280px;
      }

      .customCodeSection {
        height: 128px;
        padding-bottom: 24px;

        &_description {
          color: $grayColor;
        }

        &_code {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-weight: bold;
          color: $mainBrownColor;
          letter-spacing: 2px;
        }
      }

      .publicSection {
        margin-bottom: 12px;

        &_input {
          margin-bottom: 12px;
        }

        &_info {
          font-size: 14px;
          font-style: italic;
          color: $lightGrayColor;
          margin: 12px 0;
        }
      }
    }
  }

  @media (max-width: 410px) {
    .createGameView_card {
      padding: 4px;
    }
  }

  @media (max-width: 380px) {
    .createGameView .creamCard {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }
  }
</style>
