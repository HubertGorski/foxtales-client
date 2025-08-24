<script setup lang="ts">
import { computed, toRef } from "vue";
import HubDivider from "../hubComponents/HubDivider.vue";
import { Game } from "@/models/Game";
import { useSignalRStore } from "@/stores/signalRStore";

const signalRStore = useSignalRStore();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);
</script>

<template>
  <div class="stepEnd">
    <HubDivider />
    Wygrał gracz {{ game.users[0].username }}
    Drugie miejsce
    Trzecie miejsce
    <HubDivider />
    
    Gracz który wybierał najczęściej Twoje odpowiedzi.
    Gracz którego odpowiedzi wybierałeś najczęściej
    <HubDivider />

    Przejdź do sklepu by zwiększyć pulę pytań
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.stepEnd {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
