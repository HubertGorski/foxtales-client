<script setup lang="ts">
import type { Deck } from "@/models/Deck";
import { useUserStore } from "@/stores/userStore";
import { computed, ref, watch } from "vue";
import {
  convertDecksToListElement,
  type ListElement,
} from "../selectLists/ListElement";
import WhiteCard from "../WhiteCard.vue";
import WhiteSelectList from "../selectLists/WhiteSelectList.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import { DylematyCard } from "@/models/DylematyCard";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();

const props = defineProps({
  newCard: {
    type: DylematyCard,
    required: true,
  },
  isCardCreatorOpen: {
    type: Boolean,
    required: true,
  },
  addMany: {
    type: Boolean,
  },
});

const emit = defineEmits<{
  (e: "addCard", decks: Deck[]): void;
}>();

const actualDecks = ref<ListElement[]>(
  userStore.user.decks.map(convertDecksToListElement)
);

watch(userStore.user.decks, (newDecks) => {
  actualDecks.value = newDecks.map(convertDecksToListElement);
});

watch(
  () => props.isCardCreatorOpen,
  (isOpen) => {
    if (!isOpen) {
      actualDecks.value.forEach((deck) => (deck.isSelected = false));
    }
  }
);

const addCard = () => {
  const selectedActualDeckIds = new Set(
    actualDecks.value.filter((deck) => deck.isSelected).map((c) => c.id)
  );

  const selectedUserDecks = userStore.user.decks.filter((deck) =>
    selectedActualDeckIds.has(deck.id)
  );

  actualDecks.value = userStore.user.decks.map(convertDecksToListElement);

  emit("addCard", selectedUserDecks);
};

const addCardBtn = computed(() => ({
  text: "add",
  isOrange: true,
  action: addCard,
  disabled: !actualDecks.value.filter((deck) => deck.isSelected)
    .length,
}));

const translatedCardType = computed(() => {
  return t(`${props.newCard.type}`).toLowerCase();
});
</script>

<template>
  <div class="cardCreator creamCard">
    <div class="cardCreator_title">{{ $t("dylematy.addToDeck") }}</div>
    <WhiteCard
      v-if="!addMany"
      :header="$t('dylematy.createdCard', { type: translatedCardType })"
    >
      <div class="card">
        {{ newCard.text }}
      </div>
    </WhiteCard>
    <WhiteSelectList
      v-model="actualDecks"
      emptyDataText="dylematy.noDeckHasBeenCreatedYet"
      customSelectedCountTitle="dylematy.selectedDecks"
      :height="198"
      showSelectedCount
      multiple
      showPagination
    />
    <HubBtn
      class="cardCreator_btn"
      :action="addCardBtn.action"
      :text="addCardBtn.text"
      :isOrange="addCardBtn.isOrange"
      :disabled="addCardBtn.disabled"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.cardCreator {
  width: 324px;
  padding: 12px;

  &_title {
    color: $grayColor;
    font-size: 24px;
    font-weight: 600;
  }

  .card {
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
