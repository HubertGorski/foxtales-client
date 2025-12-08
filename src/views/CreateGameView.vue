<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue';
  import HubSwitch from '@/components/hubComponents/HubSwitch.vue';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { useSignalRStore } from '@/stores/signalRStore';
  import router from '@/router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { Game } from '@/models/Game';
  import SelectQuestionsPanel, {
    type SelectedQuestions,
  } from '@/components/SelectQuestionsPanel.vue';
  import type { Question } from '@/models/Question';
  import { useUserStore } from '@/stores/userStore';
  import WhiteSelectList from '@/components/selectLists/WhiteSelectList.vue';
  import {
    convertCatalogsToListElement,
    type ListElement,
  } from '@/components/selectLists/ListElement';

  const signalRStore = useSignalRStore();
  const userStore = useUserStore();

  const newGame = ref(signalRStore.game || new Game());
  const currentGame = computed<Game>(() => toRef(signalRStore, 'game').value ?? new Game());

  const currentQuestions = ref<Question[]>(signalRStore.game?.questions ?? []);
  const publicCatalogs = ref<ListElement[]>(
    userStore.publicCatalogs.map(convertCatalogsToListElement)
  );

  if (!newGame.value.code) {
    router.push(ROUTE_PATH.MENU);
  }

  const leaveRoom = async () => {
    await signalRStore.leaveRoom(userStore.user.userId);
    router.push(ROUTE_PATH.MENU);
  };

  const editRoom = async () => {
    newGame.value.selectedPublicCatalogId =
      publicCatalogs.value.find(catalog => catalog.isSelected)?.id ?? null;

    await signalRStore.editRoom(newGame.value);
    await signalRStore.addPrivateQuestionsToGame(userStore.user.userId, currentQuestions.value);

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

  watch(currentGame, (game: Game | null) => {
    if (game) {
      newGame.value.users = game.users;
      newGame.value.questions = game.questions;
    }
  });
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <img src="@/assets/imgs/fox7.webp" alt="Lisek" class="fox" />
      <div class="creamCard">
        <p class="title">{{ $t('lobby.createGame') }}</p>
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
        />
        <SelectQuestionsPanel
          v-model:usePrivateQuestions="newGame.usePrivateQuestions"
          @setQuestions="setCurrentQuestions"
        />
        <HubSwitch
          v-model="newGame.isQuestionsFromAnotherGamesAllowed"
          label="lobby.isQuestionsFromAnotherGamesAllowed"
        />
        <HubSwitch
          v-model="newGame.isPublic"
          label="lobby.gameVisibleOnList"
          tooltipText="tooltip.roomOnListDescription"
          withIcon
        />
        <HubSwitch
          v-model="newGame.useDixitRules"
          label="lobby.useDixitRules"
          tooltipText="tooltip.useDixitRules"
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
  </div>
</template>

<style lang="scss">
  @import '@/assets/styles/variables';

  .createGameView {
    background: $mainBackground;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .creamCard {
      padding: 14px;
    }

    &_card {
      padding: 12px 24px;
      width: 100%;
      position: relative;
      margin: 38px;

      .fox {
        position: absolute;
        height: 132px;
        right: 32px;
        top: -46px;
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

  @media (max-width: 420px) {
    .createGameView_card {
      padding: 4px;
    }
    .creamCard {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }
  }
</style>
