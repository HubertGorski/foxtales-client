<script setup lang="ts">
import { Game } from '@/models/Game';
import { useSignalRStore } from '@/stores/signalRStore';
import { computed, toRef } from 'vue';

const signalRStore = useSignalRStore();

const game = computed<Game>(
  () => toRef(signalRStore, "game").value ?? new Game()
);
</script>

<template>
  <div class="stepResults">
    StepResults
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.stepResults {
}
</style>
