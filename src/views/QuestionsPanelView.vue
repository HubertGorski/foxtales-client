<script setup lang="ts">
import { ROUTE_PATH } from '@/router/routeEnums';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import HubDivider from '@/components/hubComponents/HubDivider.vue';

const router = useRouter();
const { t } = useI18n();

const btns = [
  {
    id: 1,
    text: t("back"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.SETTINGS)
  },
  {
    id: 2,
    text: "Kup premium",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
    disabled: true
  },
]
</script>

<template>
  <div class="questionsPanelView">
    <div class="questionsPanel">
      <div class="whiteCard">
        Dodaj pytanie do prywatnej biblioteki
      </div>
      <HubDivider />
      <div class="whiteCard">
        <div>
          Usuń pytanie
        </div>
      </div>
    </div>
    <div class="controls">
      <HubBtn class="controls_btn" :action="btns[0].action" :text="btns[0].text" :isOrange="btns[0].isOrange"/>
      <HubBtn class="controls_btn" :action="btns[1].action" :text="btns[1].text" :isOrange="btns[1].isOrange" :disabled="btns[1].disabled"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.questionsPanelView {
  background: $mainBackground;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .questionsPanel {
    .title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 14px;
      font-style: italic; 
      color: $lightGrayColor;  
      margin-top: 10px;
      letter-spacing: 0.5px; 
      font-weight: 600;
    } 
  }
    .controls {
      display: flex;
      gap: 12px;
      
      &_btn {
        padding: 12px 24px;
      }
    }
}

</style>
