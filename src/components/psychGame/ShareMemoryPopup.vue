<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import HubShareBtn from '../hubComponents/HubShareBtn.vue';
  import MemoryCard from './MemoryCard.vue';
  import HubPopup from '../hubComponents/HubPopup.vue';
  import type { Game } from '@/models/Game';
  import { computed } from 'vue';
  import { Memory } from '@/models/Memory';
  import { VIEW } from '@/enums/viewsEnum';
  import { MemoryAnswer } from '@/models/MemoryAnswer';
  import { MemoryAnswerTranslation } from '@/models/MemoryAnswerTranslation';
  import type { LANG } from '@/enums/languagesEnum';
  import type { Answer } from '@/models/Answer';

  const { game } = defineProps<{
    game: Game;
  }>();

  const mapAnswerToMemoryAnswer = (answer: Answer, ownerUsername: string, ownerLanguage: LANG) => {
    const translations: MemoryAnswerTranslation[] = [];
    translations.push(new MemoryAnswerTranslation(answer.answer, ownerLanguage));

    if (answer.answerInOtherLanguages) {
      for (const [lang, text] of Object.entries(answer.answerInOtherLanguages)) {
        if (text) {
          translations.push(new MemoryAnswerTranslation(text, lang as LANG));
        }
      }
    }

    return new MemoryAnswer(ownerUsername, translations);
  };

  const isMemoriesCardAvailable = defineModel({ type: Boolean, required: true });
  const areUsersHidden = computed((): boolean =>
    game.users.some(user => user.currentView === VIEW.SELECT_ANSWER)
  );

  const memory = computed(
    () =>
      new Memory(
        game.currentQuestion!,
        game.users
          .filter(user => user.answer !== null)
          .map(user => mapAnswerToMemoryAnswer(user.answer!, user.username, user.language)),
        areUsersHidden.value
      )
  );
</script>

<template>
  <HubPopup v-model="isMemoriesCardAvailable">
    <div class="shareMemoryPopup">
      <img class="shareMemoryPopup_img" src="@/assets/imgs/memory.webp" alt="Lisek" />
      <div class="shareMemoryPopup_title">{{ $t('captureMoment') }}</div>
      <MemoryCard :memory="memory" />
      <div class="shareMemoryPopup_btns">
        <div class="btn">
          <HubBtn text="save" :icon="ICON.ADD_TO_COLLECTION" small useGap :action="() => {}" />
        </div>
        <div class="btn">
          <HubShareBtn url="https://foxtales.cc" title="Fox Tales" text="Be as sly as a fox!" />
        </div>
      </div>
    </div>
  </HubPopup>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .shareMemoryPopup {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
    background: $background;
    border-radius: 16px;
    box-shadow:
      0 12px 40px rgb(0, 0, 0, 0.18),
      0 2px 8px rgb(0, 0, 0, 0.08);

    &_img {
      height: 132px;
      width: 132px;
      position: absolute;
      top: -74px;
      right: 0;
    }

    &_title {
      font-size: 22px;
      font-weight: 700;
      color: $mainBrownColor;
      letter-spacing: -0.5px;
      padding: 0 8px;
    }

    &_btns {
      display: flex;
      gap: 4px;

      .btn {
        flex: 1;
      }
    }
  }
</style>
