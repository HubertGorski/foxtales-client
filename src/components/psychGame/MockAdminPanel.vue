<script setup lang="ts">
  import { ref, watch } from 'vue';
  import HubCheckbox from '../hubComponents/HubCheckbox.vue';
  import { Game } from '@/models/Game';
  import { useUserStore } from '@/stores/userStore';
  import { useSignalRStore } from '@/stores/signalRStore';
  import HubInput from '../hubComponents/HubInput.vue';
  import { User } from '@/models/User';
  import { Answer } from '@/models/Answer';
  import { Vote } from '@/models/Vote';
  import HubBtn from '../hubComponents/HubBtn.vue';
  import { Question } from '@/models/Question';
  import { GENDER } from '@/enums/userEnum';
  import { QuestionTranslations } from '@/models/QuestionTranslations';
  import { LANG } from '@/enums/languagesEnum';
  import { VIEW } from '@/enums/viewsEnum';
  import { cloneDeep } from 'lodash';
  import HubSwitchBtns, { type HubSwitchBtnsItem } from '../hubComponents/HubSwitchBtns.vue';
  import { RULES } from '@/enums/rulesEnum';

  const emit = defineEmits<{
    (e: 'closePopup'): void;
  }>();

  const newGameData = ref<Game>(new Game());
  const isOwner = ref<boolean>(true);
  const isSubjectPlayer = ref<boolean>(true);
  const playersCount = ref<string>('3');
  const userStore = useUserStore();
  const signalStore = useSignalRStore();
  const currentView = ref<HubSwitchBtnsItem>({ id: VIEW.SELECT_ANSWER, title: 'Wybieranie' });
  const currentViewOptions: HubSwitchBtnsItem[] = [
    { id: VIEW.ADD_ANSWER, title: 'Dodawanie' },
    { id: VIEW.SELECT_ANSWER, title: 'Wybieranie' },
  ];
  const currentRules = ref<HubSwitchBtnsItem>({ id: RULES.DIXIT, title: 'Dixit' });
  const currentRulesOptions: HubSwitchBtnsItem[] = [
    { id: RULES.PSYCH, title: 'Psych' },
    { id: RULES.DIXIT, title: 'Dixit' },
    { id: RULES.QUIET_DAYS, title: 'Quiet days' },
  ];

  const usersData = [
    new User({
      userId: 1,
      username: 'FoxyRed',
      accessToken: 'token_001',
      pointsInGame: 120,
      newPoints: 15,
      round: 2,
      answer: new Answer(1, 10, 1, 'Zdecydowanie tak').setAnswerInOtherLanguages({
        [LANG.PL]: 'Yes!',
      }),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(2, 3), new Vote(5, 1)],
      votesGiven: [new Vote(3, 2)],
    }),
    new User({
      userId: 2,
      username: 'SilverWolf',
      accessToken: 'token_002',
      pointsInGame: 85,
      newPoints: 10,
      round: 2,
      answer: new Answer(2, 10, 2, 'Nie sądzę').setAnswerInOtherLanguages({ [LANG.PL]: 'Nope.' }),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(1, 2)],
      votesGiven: [new Vote(1, 1)],
    }),
    new User({
      userId: 3,
      username: 'BlueFox',
      accessToken: 'token_003',
      pointsInGame: 200,
      newPoints: 30,
      round: 3,
      answer: new Answer(3, 10, 3, 'To zależy'),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(4, 1), new Vote(6, 2)],
      votesGiven: [new Vote(4, 3)],
    }),
    new User({
      userId: 4,
      username: 'NightOwl',
      accessToken: 'token_004',
      pointsInGame: 40,
      newPoints: 5,
      round: 1,
      answer: new Answer(3, 10, 3, 'Azaliż'),
      votersIdsForHisAnswer: [],
      votesReceived: [],
      votesGiven: [new Vote(6, 1)],
    }),
    new User({
      userId: 5,
      username: 'GoldPaw',
      accessToken: 'token_005',
      pointsInGame: 310,
      newPoints: 50,
      round: 3,
      answer: new Answer(5, 10, 5, 'Absolutnie!'),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(3, 4), new Vote(8, 2)],
      votesGiven: [new Vote(2, 1)],
    }),
    new User({
      userId: 6,
      username: 'IronClaw',
      accessToken: 'token_006',
      pointsInGame: 155,
      newPoints: 20,
      round: 2,
      answer: new Answer(6, 10, 6, 'Nigdy w życiu'),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(1, 3)],
      votesGiven: [new Vote(8, 2)],
    }),
    new User({
      userId: 7,
      username: 'StormFox',
      accessToken: 'token_007',
      pointsInGame: 60,
      newPoints: 0,
      round: 1,
      answer: new Answer(7, 10, 7, 'Może'),
      votersIdsForHisAnswer: [],
      votesReceived: [],
      votesGiven: [],
    }),
    new User({
      userId: 8,
      username: 'MoonWolf',
      accessToken: 'token_008',
      pointsInGame: 275,
      newPoints: 40,
      round: 3,
      answer: new Answer(8, 10, 8, 'Oczywiście że tak'),
      votersIdsForHisAnswer: [],
      votesReceived: [new Vote(5, 3), new Vote(6, 1)],
      votesGiven: [new Vote(5, 2)],
    }),
  ];

  const questionTranslationPL = new QuestionTranslations();
  questionTranslationPL.text = 'Czy wolisz kawę czy herbatę?';
  questionTranslationPL.language = LANG.PL;

  const questionTranslationEN = new QuestionTranslations();
  questionTranslationEN.text = 'Do you prefer coffee or tea?';
  questionTranslationEN.language = LANG.EN;

  const question = new Question(
    42,
    1,
    GENDER.ALL,
    true,
    15,
    new Date('2024-01-10'),
    new Date('2023-12-01')
  );
  question.translations = [questionTranslationPL, questionTranslationEN];
  question.currentUser = usersData[1];

  watch(
    playersCount,
    newVal => {
      if (newVal) {
        newGameData.value.users = usersData.slice(0, Number(newVal));
      }
    },
    { immediate: true }
  );

  const save = () => {
    if (newGameData.value.users.length > 0) {
      const firstUser = newGameData.value.users[0];
      const oldId = firstUser.userId;
      const newId = userStore.user.userId;

      firstUser.userId = newId;
      firstUser.username = userStore.user.username;

      if (firstUser.answer) {
        firstUser.answer.ownerId = newId;
        firstUser.answer.id = newId;
      }

      newGameData.value.users.forEach(u => {
        const voterIndex = u.votersIdsForHisAnswer.indexOf(oldId);
        if (voterIndex !== -1) {
          u.votersIdsForHisAnswer[voterIndex] = newId;
        }

        u.votesReceived.forEach(v => {
          if (v.voterId === oldId) v.voterId = newId;
        });

        u.votesGiven.forEach(v => {
          if (v.voterId === oldId) v.voterId = newId;
        });
      });
    }

    if (userStore.user.useAiTranslations) {
      newGameData.value.users.forEach(user => {
        user.useAiTranslations = true;
      });
    }

    newGameData.value.users.forEach(user => {
      user.currentView = currentView.value.id;
    });

    if (isOwner.value) {
      newGameData.value.owner = userStore.user;
    } else {
      newGameData.value.owner = usersData[6];
    }

    if (isSubjectPlayer.value) {
      question.currentUser = userStore.user;
    } else {
      question.currentUser = usersData[1];
    }

    newGameData.value.code = signalStore.game?.code as string;
    newGameData.value.currentQuestion = question;
    newGameData.value.questions = [question];
    newGameData.value.round = 3;
    newGameData.value.isGameStarted = true;
    newGameData.value.currentRules = currentRules.value.id;

    signalStore.game = cloneDeep(newGameData.value);

    emit('closePopup');
  };
</script>

<template>
  <div class="mockAdminPanel whiteCard">
    <HubCheckbox v-model="isOwner">Właściciel gry</HubCheckbox>
    <HubCheckbox v-model="isSubjectPlayer">Pytanie o Tobie</HubCheckbox>
    <HubCheckbox v-model="userStore.user.useAiTranslations">Tłumaczenia AI</HubCheckbox>
    <HubSwitchBtns v-model="currentView" :items="currentViewOptions" :fontSize="14" />
    <HubSwitchBtns v-model="currentRules" :items="currentRulesOptions" :fontSize="14" />
    <HubInput v-model="playersCount" textType="number" label="Liczba graczy" />
    <HubBtn text="accept" :action="save" />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .mockAdminPanel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
