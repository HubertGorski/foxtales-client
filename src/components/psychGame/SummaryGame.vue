<script setup lang="ts">
import HubDivider from "../hubComponents/HubDivider.vue";
</script>

<template>
  <div class="summaryGame">
    <HubDivider :text="$t('summary')" />
    <div class="whiteCard whiteCardContent">
      <span> Gracze, których najbardziej bawisz: Antek, Maryla, </span>
      <br />
      ---
      <br />
      <span> Gracze, którzy najbardziej bawią Ciebie: Natka, Adam, </span>
      <br />
      ---
      <br />
      <span> Dowiedziałeś się o sobie 132 rzeczy. </span>

      <br />
      ---
      <br />
      <span> Wybrano Twoje odpowiedzi 10 razy. </span>
    </div>
    <img src="@/assets/imgs/fox11.webp" alt="Lisek" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.summaryGame {
  display: flex;
  flex-direction: column;
  align-items: end;
  height: 100%;

  .whiteCard {
    flex-grow: 1;
  }

  img {
    max-width: 124px;
  }
}
</style>
