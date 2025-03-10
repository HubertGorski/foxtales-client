import HubBtn from "./hubComponents/HubBtn.vue";
<script setup lang="ts">
import { Deck } from '@/models/Deck';
import { useUserStore } from '@/stores/userStore';
import { computed, ref, watch } from 'vue';
import { convertCardToListElement, ListElement } from '../whiteSelectList/ListElement';
import { ICON } from '@/enums/iconsEnum';
import WhiteSelectList from '../whiteSelectList/WhiteSelectList.vue';
import HubBtn from '../hubComponents/HubBtn.vue';


const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "closePopup"): void;
}>();

const deck = defineModel({ type: Deck, required: true });

const userStore = useUserStore();

const formBtn = computed(() => {
  return {
    text: props.editMode ? "accept" : "add",
    isOrange: true,
    action: props.editMode ? editDeck : addDeck,
    disabled: deck.value.title.length < 3 || !deck.value.size,
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

const closePopup = () => {
  emit("closePopup");
};

const getActualCards = () => {
  const items = userStore.user.negativeCards.map(convertCardToListElement);
  items.forEach((item) => {
    if (
      deck.value.cards.map((card) => card.id).includes(item.id)
    ) {
      item.setSelected();
    }
  });

  return items;
};

const addSelectedCardsToDeck = () => {
  const selectedCards = actualCards.value
    .filter((card) => card.isSelected)
    .map((card) => card.id);

  const cards = userStore.user.dylematyCards.filter((card) =>
    selectedCards.includes(card.id)
  );

  deck.value.setCards(cards);
};

const actualCards = ref<ListElement[]>(getActualCards());

watch(deck, () => { 
  actualCards.value = getActualCards();
});

</script>

<template>
  <div class="deckCreator creamCard">
    <div class="deckCreator_title">
      <div v-if="editMode">{{ $t('dylematy.editDeck') }}</div>
      <div v-else>{{ $t('dylematy.createDeck') }}</div>
      <v-icon @click="closePopup">{{ ICON.X }}</v-icon>
    </div>
    <v-text-field v-model="deck.title" :label="$t('title')" hide-details />
    <v-textarea
      v-model="deck.description"
      :label="$t('description')"
      :rows="3"
      hide-details
    />
    <div class="deckCreator_subtitle">{{ $t('dylematy.chooseDeckSize') }}</div>
    <div class="selectSize">
      <div
        class="selectSize_size"
        :class="{ isSelected: deck.size === type.size }"
        @click="deck.size = type.size"
        v-for="type in deck.availableTypes"
        :key="type.id"
      >
        <p class="deckName">{{ $t(type.name) }}</p>
        <p class="deckSize">{{ `${$t("size")}: ${type.size}` }}</p>
      </div>
    </div>
    <WhiteSelectList
      v-model="actualCards"
      customSelectedCountTitle="selectedCardsToDeck"
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
  }

  &_subtitle {
    color: $grayColor;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
  .selectSize {
    display: flex;
    justify-content: space-around;
    align-items: center;

    &_size {
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      border-radius: 8px;
      color: $grayColor;
      transition: all 0.2s;
      padding: 12px;
      &.isSelected {
        font-weight: 600;
        transform: scale(1.1);
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 6px;
        transition: all 0.2s;
      }

      .deckName {
        text-align: center;
      }

      .deckSize {
        text-align: center;
        font-size: 12px;
      }
    }
  }

  &_btn {
    padding: 8px;
  }
}
</style>
