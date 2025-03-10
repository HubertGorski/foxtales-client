<script setup lang="ts">
import { ref } from "vue";
import HubPopup from "@/components/hubComponents/HubPopup.vue";
import HubAccordion from "@/components/hubComponents/HubAccordion.vue";
import HubAccordionElement from "@/components/hubComponents/HubAccordionElement.vue";
import { Deck } from "@/models/Deck";
import { useUserStore } from "@/stores/userStore";
import NavigationBtns from "@/components/NavigationBtns.vue";
import WhiteSelectList from "@/components/whiteSelectList/WhiteSelectList.vue";
import {
  convertDecksToListElement,
  ListElement,
} from "@/components/whiteSelectList/ListElement";
import { DylematyCard } from "@/models/DylematyCard";
import DeckCreator from "@/components/dylematy/DeckCreator.vue";
import CardCreator from "@/components/dylematy/CardCreator.vue";

const userStore = useUserStore();

const addCard = (decks: Deck[]) => {
  event.preventDefault();
  if (!newCard.value) {
    return;
  }

  console.log(`Dodano kartę: "${newCard.value}"`);
  if (decks && decks.length > 0) {
    console.log(
      `Dodano do talii: "${decks.map((deck) => deck.title)}"`
    );
  }
  isCardCreatorOpen.value = false;
  newCard.value = new DylematyCard();
};

const addNewDeck = () => {
  editDeckMode.value = false;
  isDeckCreatorOpen.value = true;
  currentDeck.value = new Deck();
};

const showDecksList = () => {
  isCardCreatorOpen.value = true;
};

const showDeckDetails = (deck: ListElement) => {
  currentDeck.value = userStore.user.decks.find(
    (actualDeck) => actualDeck.id === deck.id
  )!;
  editDeckMode.value = true;
  isDeckCreatorOpen.value = true;
};

const addCardBtn = {
  text: "add",
  isOrange: true,
  action: addCard,
};

const actualDecks = ref<ListElement[]>(
  userStore.user.decks.map(convertDecksToListElement)
);

const closePopup = () => {
  isDeckCreatorOpen.value = false;
  setOpenTab.value = "dylematy.yourDecks";
  actualDecks.value = userStore.user.decks.map(
    convertDecksToListElement
  );
};

const isDeckCreatorOpen = ref<boolean>(false);
const isCardCreatorOpen = ref<boolean>(false);
const setOpenTab = ref<string>("addCard");
const newCard = ref<DylematyCard>(new DylematyCard());
const currentDeck = ref<Deck>(new Deck());
const editDeckMode = ref<boolean>(true);
</script>

<template>
  <div class="libraryView">
    <HubPopup v-model="isCardCreatorOpen">
      <CardCreator :newCard="newCard" @addCard="addCard" />
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
        <div>addCardToLibraryxd</div>
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
      <div class="manageLibrary_isComing">
        <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
        <p>
          {{ $t("isComing") }}
        </p>
      </div>
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

    &_isComing {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0.9;
      color: $mainBrownColor;
      font-weight: 600;

      img {
        width: 160px;
        height: 140px;
      }
    }
  }
}
</style>
