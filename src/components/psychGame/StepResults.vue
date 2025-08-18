<script setup lang="ts">
import { Game } from '@/models/Game';

const props = defineProps({
  game: {
    type: Game,
    required: true,
  },
});

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
