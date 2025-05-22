<script setup lang="ts">
import { computed, ref, watch } from "vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import { Deck } from "@/models/Deck";
import { useUserStore } from "@/stores/userStore";
import NavigationBtns from "@/components/NavigationBtns.vue";
import WhiteSelectList from "@/components/selectLists/WhiteSelectList.vue";
import {
  convertDecksToListElement,
  convertDylematyCardToListElement,
  convertListElementToDeck,
  ListElement,
} from "@/components/selectLists/ListElement";
import { DYLEMATY_CARD_TYPE, DylematyCard } from "@/models/DylematyCard";
import DeckCreator from "@/components/dylematy/DeckCreator.vue";
import CardCreator from "@/components/dylematy/CardCreator.vue";
import { ICON } from "@/enums/iconsEnum";
import HubInputWithBtn from "@/components/hubComponents/HubInputWithBtn.vue";
import HubSwitchBtns, { type HubSwitchBtnsItem } from "@/components/hubComponents/HubSwitchBtns.vue";
import ScrollSelectList from "@/components/selectLists/ScrollSelectList.vue";

const userStore = useUserStore();

const addCard = (decks: Deck[]) => {
  event.preventDefault();
  if (addManyCardsToDecks.value) {
    return assignedCardsToDecks(decks);
  }

  if (!newCard.value) {
    return;
  }

  console.log(`Dodano kartę: "${newCard.value.text}", która jest "${newCard.value.type}"`);
  if (decks && decks.length > 0) {
    console.log(`Dodano do talii: "${decks.map((deck) => deck.title)}"`);
  }
  isCardCreatorOpen.value = false;
  newCard.value = new DylematyCard();
  selectedCardType.value = null;
};

const addCardBtn = computed(() => {
  return {text: "add",
  isOrange: true,
  action: addCard,
  btnIsDisabled: selectedCardType.value === null}
});

const addNewDeck = () => {
  editDeckMode.value = false;
  isDeckCreatorOpen.value = true;
  setOpenTab.value = "";
  currentDeck.value = new Deck();
};

const addCardsToDeck = (questions: ListElement[]) => {
  addManyCardsToDecks.value = true;
  isCardCreatorOpen.value = true;
  selectedCards.value = questions;
}

const showDecksList = () => {
  addManyCardsToDecks.value = false;
  isCardCreatorOpen.value = true;
};

const assignedCardsToDecks = (decks: Deck[]) => {
  const selectedActualCardsIds = selectedCards.value.map((question) => question.id);
  const selectedActualDecksIds = decks.map((deck) => deck.id);
  console.log('dodaje decki o id: ', selectedActualDecksIds, 'i karty o id: ', selectedActualCardsIds, 'do bazy relacja manyTomany');
  isCardCreatorOpen.value = false;
  addManyCardsToDecks.value = false;
  selectedCards.value = [];
  actualCards.value.forEach(card => card.isSelected = false);
}

const showDeckDetails = (deck: ListElement) => {
  currentDeck.value = convertListElementToDeck(
    actualDecks.value.find((actualDeck) => actualDeck.id === deck.id)!
  );
  editDeckMode.value = true;
  isDeckCreatorOpen.value = true;
};

const actualDecks = ref<ListElement[]>(
  userStore.user.decks.map(convertDecksToListElement)
);

const closePopup = (refresh: boolean = false) => {
  isDeckCreatorOpen.value = false;

  if (refresh) {
    setOpenTab.value = "dylematy.yourDecks";
    actualDecks.value = userStore.user.decks.map(convertDecksToListElement);
  }
};

const deleteCards = (cards: ListElement[]) => {
  const cardsIds = cards.map((card) => card.id);
  console.log('usuwam carty o ids:', cardsIds);
}

const isDeckCreatorOpen = ref<boolean>(false);
const isCardCreatorOpen = ref<boolean>(false);
const setOpenTab = ref<string>("addCard");
const newCard = ref<DylematyCard>(new DylematyCard());
const actualCards = ref<ListElement[]>(userStore.user.dylematyCards.map(convertDylematyCardToListElement));
const currentDeck = ref<Deck>(new Deck());
const editDeckMode = ref<boolean>(true);
const selectedCardType = ref<HubSwitchBtnsItem | null>(null);
const addManyCardsToDecks = ref<boolean>(false);
const selectedCards = ref<ListElement[]>([]);
const availableTypes: HubSwitchBtnsItem[] = [
  { id: 1, title: DYLEMATY_CARD_TYPE.POSITIVE },
  { id: 2, title: DYLEMATY_CARD_TYPE.NEGATIVE }
];

watch(selectedCardType, (newSelectedCardType) => {
  newCard.value.type = newSelectedCardType ? newSelectedCardType.title as DYLEMATY_CARD_TYPE || null : null;
});
</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isCardCreatorOpen">
      <CardCreator :newCard="newCard" @addCard="addCard" :isCardCreatorOpen=isCardCreatorOpen :addMany="addManyCardsToDecks" />
    </HubPopup>
    <HubPopup v-model="isDeckCreatorOpen">
      <DeckCreator
        v-model="currentDeck"
        :editMode="editDeckMode"
        @closePopup="closePopup"
      />
    </HubPopup>
    <HubAccordionElement
      @click="addNewDeck"
      title="dylematy.addDeck"
      isSmallerTitle
    />
    <HubAccordion
      v-model="setOpenTab"
      :slotNames="['dylematy.yourDecks', 'dylematy.addCard']"
      isSmallerTitle
    >
      <template #dylematy.yourDecks>
        <WhiteSelectList
          class="yourDecks"
          v-model="actualDecks"
          :height="146"
          :itemsPerPage="3"
          :fontSize="14"
          emptyDataText="dylematy.noDeckHasBeenCreatedYet"
          multiple
          showPagination
          showElementsCountInItem
          showItemDetailsBtn
          @showDetails="showDeckDetails"
        />
      </template>
      <template #dylematy.addCard>
        <div class="addCardToLibrary">
          <HubInputWithBtn
            v-model="newCard.text"
            :btnAction="addCardBtn.action"
            :btnText="addCardBtn.text"
            :btnIsDisabled="addCardBtn.btnIsDisabled"
            :extraBtnIcon="ICON.ADD_TO_COLLECTION"
            :extraBtnAction="showDecksList"
            :btnIsOrange="addCardBtn.isOrange"
            isTextarea
          >
            <HubSwitchBtns v-model="selectedCardType" :items="availableTypes" />
          </HubInputWithBtn>
        </div>
      </template>
    </HubAccordion>
    <HubAccordionElement
      @click="setOpenTab = ''"
      class="manageLibrary"
      title="dylematy.yourCards"
      isOpen
      isSmallerTitle
      centerContent
    >
      <ScrollSelectList v-model="actualCards" addCutomText="dylematy.addToDeck" isTypeAvailable @addItems="addCardsToDeck" @deleteItems="deleteCards" />
    </HubAccordionElement>
    <NavigationBtns btn="back" btn2="shop" btn2Disabled />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.libraryView {
  background: $mainBackground;
  height: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .yourDecks {
    padding: 8px;
  }

  .addCardToLibrary {
    padding: 12px;
  }

  .manageLibrary {
    flex-grow: 1;
  }
}
</style>