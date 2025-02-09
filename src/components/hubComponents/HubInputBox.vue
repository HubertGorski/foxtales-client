<script setup lang="ts">
import { computed, ref } from 'vue';
import HubBtn from './HubBtn.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  btnText: {
    type: String,
    required: true,
  },
  btnIsOrange: {
    type: Boolean,
  },
  btnAction: {
    type: Function,
    required: true,
  },
  textPlaceholder: {
    type: String,
  },
  textType: {
    type: String,
  },
  withFoxImg: {
    type: Boolean,
    default: false
  },
  isTextarea: {
    type: Boolean,
    default: false
  }
});

const text = defineModel({ type: String, required: true });

const btnIsDisabled = computed(() => {
    return text.value.length === 0
});
</script>

<template>
  <div class="hubInputBox whiteCard">
    <img v-if="withFoxImg" class="hubInputBox_fox" src="@/assets/imgs/fox7.png" alt="Lisek" />
    <p class="hubInputBox_subtitle">{{ $t(title) }}</p>
      <div class="hubBox">
        <v-textarea v-if="isTextarea"
        v-model="text"
        @keydown.enter="btnAction" 
        :auto-grow="false"/>
        <v-text-field v-else
        v-model="text"
        hide-details
        @keydown.enter="btnAction"
        :placeholder="textPlaceholder ? $t(textPlaceholder) : ''" 
        :type="textType"/>
        <HubBtn class="hubBox_btn" :action="btnAction" :text="btnText" :isOrange="btnIsOrange" :disabled="btnIsDisabled"/>
      </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.hubInputBox {
  position: relative;

  &_fox {
    width: 120px;
    position: absolute;
    top: -48px;
    right: -24px;
  }

  &_subtitle {
    color: $grayColor;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 12px;
  }

  .hubBox {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &_btn {
      padding: 6px;
      font-size: 18px;
      width: auto;
    }
  }

}
</style>