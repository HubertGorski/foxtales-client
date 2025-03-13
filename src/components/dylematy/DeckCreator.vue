import HubBtn from "./hubComponents/HubBtn.vue";
<script setup lang="ts">
import { Deck } from "@/models/Deck";
import { useUserStore } from "@/stores/userStore";
import { computed, ref, watch } from "vue";
import {
  convertDylematyCardToListElement,
  ListElement,
} from "../whiteSelectList/ListElement";
import { ICON } from "@/enums/iconsEnum";
import WhiteSelectList from "../whiteSelectList/WhiteSelectList.vue";
import HubBtn from "../hubComponents/HubBtn.vue";
import { cloneDeep, isEqual } from "lodash";
import HubSwitchBtns, {
  type HubSwitchBtnsItem,
} from "../hubComponents/HubSwitchBtns.vue";

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "closePopup", refresh: boolean): void;
}>();

const deck = defineModel({ type: Deck, required: true });

const userStore = useUserStore();

const isUndoBtnVisible = computed(
  () =>
    props.editMode &&
    (!isEqual(backupDeckDetails.value, deck.value) ||
      !isEqual(getSelectedCards(), deck.value.cards))
);

const formBtn = computed(() => {
  return {
    text: props.editMode ? "accept" : "add",
    isOrange: true,
    action: props.editMode ? editDeck : addDeck,
    disabled:
      deck.value.title.length < 3 ||
      !deck.value.size ||
      (props.editMode ? !isUndoBtnVisible.value : false),
  };
});

const addDeck = () => {
  addSelectedCardsToDeck();
  deck.value.id = Math.floor(Math.random() * 999);
  userStore.addDeck(deck.value);
  console.log("Dodano katalog: ", deck.value.title);
  actualCards.value = getActualCards();
  deck.value = new Deck();
  closePopup();
};

const editDeck = () => {
  addSelectedCardsToDeck();
  userStore.editDeck(deck.value);
  console.log("Edytowano katalog: ", deck.value.title);
  actualCards.value = getActualCards();
  deck.value = new Deck();
  closePopup();
};

const closePopup = (refresh: boolean = true) => {
  emit("closePopup", refresh);
};

const getActualCards = () => {
  const items = userStore.user.dylematyCards.map(
    convertDylematyCardToListElement
  );
  items.forEach((item) => {
    if (deck.value.cards.map((card) => card.id).includes(item.id)) {
      item.setSelected();
    }
  });

  return items;
};

const getSelectedCards = () => {
  const selectedCards = actualCards.value
    .filter((card) => card.isSelected)
    .map((card) => card.id);

  return userStore.user.dylematyCards.filter((card) =>
    selectedCards.includes(card.id)
  );
};

const addSelectedCardsToDeck = () => {
  const cards = getSelectedCards();
  deck.value.setCards(cards);
};

const undoAction = () => {
  deck.value = backupDeckDetails.value;
};

const actualCards = ref<ListElement[]>(getActualCards());
const backupDeckDetails = ref<Deck>(new Deck());

const selectedSize = ref<HubSwitchBtnsItem | null>(null);
const availableTypes: HubSwitchBtnsItem[] = [
  { id: 1, title: "small", subtitle: "30" },
  { id: 2, title: "medium", subtitle: "60" },
  { id: 3, title: "large", subtitle: "120" },
];

watch(deck, () => {
  backupDeckDetails.value = cloneDeep(deck.value);
  actualCards.value = getActualCards();
  selectedSize.value = availableTypes.find(type => Number(type.subtitle) === deck.value.size) || null;
});

watch(selectedSize, (newSelectedSize) => {
  deck.value.size = newSelectedSize ? Number(newSelectedSize.subtitle) : 0;
});
</script>

<template>
  <div class="deckCreator creamCard">
    <div class="deckCreator_title">
      <div v-if="editMode">{{ $t("dylematy.editDeck") }}</div>
      <div v-else>{{ $t("dylematy.createDeck") }}</div>
      <div>
        <v-icon
          class="controlBtn"
          v-if="isUndoBtnVisible"
          @click="undoAction"
          >{{ ICON.UNDO }}</v-icon
        >
        <v-icon class="controlBtn" @click="closePopup(false)">{{
          ICON.X
        }}</v-icon>
      </div>
    </div>
    <v-text-field v-model="deck.title" :label="$t('title')" hide-details />
    <v-textarea
      v-model="deck.description"
      :label="$t('description')"
      :rows="3"
      hide-details
    />
    <div class="deckCreator_subtitle">{{ $t("dylematy.chooseDeckSize") }}</div>
    <HubSwitchBtns v-model="selectedSize" :items="availableTypes" />
    <WhiteSelectList
      v-model="actualCards"
      customSelectedCountTitle="dylematy.selectedCardsToDeck"
      emptyDataText="dylematy.noCardHasBeenCreatedYet"
      :fontSize="14"
      showSelectedCount
      multiple
      showPagination
    />
    <HubBtn
      class="deckCreator_btn"
      :action="formBtn.action"
      :text="formBtn.text"
      :disabled="formBtn.disabled"
      :isOrange="formBtn.isOrange"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.deckCreator {
  width: 324px;
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

    .controlBtn {
      padding: 0 8px;
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
