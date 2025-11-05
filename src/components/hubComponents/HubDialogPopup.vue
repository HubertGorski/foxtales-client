<script setup lang="ts">
  import HubBtn from './HubBtn.vue';
  import HubPopup from './HubPopup.vue';

  const props = defineProps({
    textPopup: {
      type: String,
      required: true,
    },
    confirmAction: {
      type: Function,
      required: true,
    },
  });

  const isPopupOpen = defineModel({ type: Boolean, required: true });

  const backBtn = {
    text: 'reject',
    isOrange: false,
    action: () => (isPopupOpen.value = false),
  };
  const confirmBtn = {
    text: 'accept',
    isOrange: false,
    action: () => props.confirmAction(),
  };
</script>

<template>
  <HubPopup v-model="isPopupOpen">
    <div class="creamCard">
      <img class="fox" src="/imgs/fox6.webp" alt="Lisek" />
      <p>{{ textPopup }}</p>
      <div class="btns">
        <HubBtn :action="backBtn.action" :text="backBtn.text" :isOrange="backBtn.isOrange" />
        <HubBtn
          :action="confirmBtn.action"
          :text="confirmBtn.text"
          :isOrange="confirmBtn.isOrange"
        />
      </div>
    </div>
  </HubPopup>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .creamCard {
    padding: 12px;
    margin: 12px;
    max-width: 340px;

    img {
      max-height: 300px;
      max-width: 250px;
      margin: 0 auto;
    }

    p {
      text-align: center;
      padding: 24px 0;
      font-size: 18px;
      color: $grayColor;
    }

    .btns {
      display: flex;
      gap: 8px;

      .hubBtn {
        padding: 8px;
      }
    }
  }
</style>
