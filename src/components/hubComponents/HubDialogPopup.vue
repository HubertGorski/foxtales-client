<script setup lang="ts">
  import HubBtn from './HubBtn.vue';
  import HubPopup from './HubPopup.vue';

  const props = defineProps({
    backBtnText: {
      type: String,
      default: 'reject',
    },
    confirmBtnText: {
      type: String,
      default: 'accept',
    },
    textPopup: {
      type: String,
      required: true,
    },
    showDefaultImg: {
      type: Boolean,
      default: true,
    },
    confirmAction: {
      type: Function,
      required: true,
    },
    backAction: {
      type: Function,
      required: false,
    },
  });

  const isPopupOpen = defineModel({ type: Boolean, required: true });

  const backBtn = {
    text: props.backBtnText,
    isOrange: false,
    action: () => backAction(),
  };
  const confirmBtn = {
    text: props.confirmBtnText,
    isOrange: false,
    action: () => props.confirmAction(),
  };

  const backAction = () => {
    isPopupOpen.value = false;
    if (props.backAction) {
      props.backAction();
    }
  };
</script>

<template>
  <HubPopup v-model="isPopupOpen">
    <div class="creamCard">
      <img v-if="showDefaultImg" class="fox" src="/imgs/fox6.webp" alt="Lisek" />
      <slot></slot>
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
  @use '@/assets/styles/variables' as *;

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
