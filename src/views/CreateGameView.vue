<script setup lang="ts">
import { computed, ref, watch } from "vue";
import HubSwitch from "@/components/hubComponents/HubSwitch.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useSignalRStore } from "@/stores/signalRStore";
import router from "@/router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { Game } from "@/models/Game";
import WhiteSelectList from "@/components/selectLists/WhiteSelectList.vue";
import {
  convertCatalogsToListElement,
  ListElement,
} from "@/components/selectLists/ListElement";
import { useUserStore } from "@/stores/userStore";
import HubSwitchBtns, {
  type HubSwitchBtnsItem,
} from "@/components/hubComponents/HubSwitchBtns.vue";
import { useI18n } from "vue-i18n";

const signalRStore = useSignalRStore();
const { t } = useI18n();
const userStore = useUserStore();

const newGame = ref(signalRStore.game || new Game());
if (!newGame.value.code) {
  router.push(ROUTE_PATH.MENU);
}

const removeRoom = async () => {
  await signalRStore.removeRoom();
  router.push(ROUTE_PATH.MENU);
};

const editRoom = async () => {
  await signalRStore.editRoom(newGame.value);
  router.push(ROUTE_PATH.LOBBY);
};

const catalogs = ref<ListElement[]>(
  userStore.user.catalogs.map(convertCatalogsToListElement)
);

const privateQuestionsSelectedOptions: HubSwitchBtnsItem[] = [
  { id: 1, title: t("lobby.allQuestions") },
  { id: 2, title: t("lobby.selectedCatalog") },
];

const selectedPrivateQuestionsSelectedOption = ref<HubSwitchBtnsItem>(
  privateQuestionsSelectedOptions[0]
);

const questions = computed(() => {
  if (!newGame.value.usePrivateQuestions) {
    return [];
  }

  if (
    selectedPrivateQuestionsSelectedOption.value?.id ===
    privateQuestionsSelectedOptions[0].id
  ) {
    return userStore.user.questions;
  }

  const selectedCatalogId =
    catalogs.value.find((catalog) => catalog.isSelected)?.id ?? 0;

  const selectedCatalog = userStore.user.catalogs.find(
    (catalog) => catalog.catalogId && catalog.catalogId === selectedCatalogId
  );

  if (selectedCatalog) {
    return selectedCatalog.questions;
  }

  return [];
});

watch(questions, (newQuestions) => {
  newGame.value.questions = newQuestions;
});
</script>

<template>
  <div class="createGameView">
    <div class="createGameView_card">
      <img src="@/assets/imgs/fox7.png" alt="Lisek" class="fox" />
      <div class="creamCard">
        <p class="title">{{ $t("lobby.createGame") }}</p>
        <div class="settings">
          <HubSwitch
            v-model="newGame.usePublicQuestions"
            label="lobby.usePublicQuestions"
            tooltipText="tooltip.publicQuestionsDescription"
            withIcon
          />
          <HubSwitch
            v-model="newGame.usePrivateQuestions"
            label="lobby.usePrivateQuestions"
            tooltipText="tooltip.privateQuestionsDescription"
            withIcon
          />
          <div v-if="newGame.usePrivateQuestions" class="selectOptions">
            <HubSwitchBtns
              v-model="selectedPrivateQuestionsSelectedOption"
              :items="privateQuestionsSelectedOptions"
              :fontSize="14"
            />
            <WhiteSelectList
              v-if="
                selectedPrivateQuestionsSelectedOption.id ==
                privateQuestionsSelectedOptions[1].id
              "
              v-model="catalogs"
              :itemsPerPage="1"
              showPagination
              selectVisibeItem
            />
          </div>
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
        </div>
        <div v-if="!newGame.isPublic" class="customCodeSection">
          <p class="customCodeSection_description">
            {{ $t("lobby.inviteOtherPlayers") }}
          </p>
          <p class="customCodeSection_code">{{ newGame.code }}</p>
        </div>
        <div class="publicSection" v-else>
          <v-text-field
            class="publicSection_input"
            v-model="newGame.password"
            :label="$t('lobby.entryPassword')"
            type="password"
            outlined
            dense
            hide-details
          />
          <span class="publicSection_info">{{ $t("info.passwordRoom") }}</span>
        </div>
        <NavigationBtns
          btn="closeGame"
          btn2="accept"
          :btnCustomAction="removeRoom"
          :btn2CustomAction="editRoom"
          btn2isOrange
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables";

.createGameView {
  background: $mainBackground;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .creamCard {
    padding: 14px;
  }

  &_card {
    padding: 24px 24px 0 24px;
    width: 100%;
    position: relative;
    margin: 46px;

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
    .settings {
      padding-bottom: 12px;

      .hubSwitch_content {
        max-width: 210px;
      }

      .selectOptions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 16px;
      }
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
</style>
