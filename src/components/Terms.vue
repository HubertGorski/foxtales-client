<script setup lang="ts">
  import { ref, watch } from 'vue';
  import HubPopup from './hubComponents/HubPopup.vue';
  import { useI18n } from 'vue-i18n';
  import { ICON } from '@/enums/iconsEnum';

  const { isLabelVisible = true } = defineProps<{
    isLabelVisible?: boolean;
  }>();

  const { locale } = useI18n();
  const tab = ref('');
  const termsHtml = ref('');
  const privacyHtml = ref('');
  const statuteHtml = ref('');
  const doc = ref('');
  const showTerms = ref(false);

  const cleanHtml = (html: string) => {
    const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/im);
    return match ? match[1] : html;
  };

  watch(showTerms, async value => {
    if (!value) {
      return;
    }
    if (doc.value) {
      const res = await fetch(`/legal/${doc.value}.${locale.value}.html`);
      const text = await res.text();
      termsHtml.value = cleanHtml(text);
    } else {
      const privacy = await fetch(`/legal/privacy.${locale.value}.html`);
      const statute = await fetch(`/legal/statute.${locale.value}.html`);
      const privacyText = await privacy.text();
      const statuteText = await statute.text();
      privacyHtml.value = cleanHtml(privacyText);
      statuteHtml.value = cleanHtml(statuteText);
    }
  });
</script>

<template>
  <div>
    <div @click="showTerms = true">
      <slot></slot>
    </div>
    <div v-if="isLabelVisible">
      {{ $t('terms.accept') }}
      <b
        class="termsLabel"
        @click="
          doc = 'statute';
          showTerms = true;
        "
      >
        {{ $t('terms.statute') }}
      </b>
      {{ $t('and') }}
      <b
        class="termsLabel"
        @click="
          doc = 'privacy';
          showTerms = true;
        "
      >
        {{ $t('terms.privacyPolicy') }}
      </b>
    </div>
  </div>
  <HubPopup v-model="showTerms">
    <div v-if="doc" class="terms creamCard" v-html="termsHtml"></div>
    <div v-else class="creamCard">
      <div class="tabs">
        <v-tabs v-model="tab" slider-color="var(--grayColor)">
          <v-tab value="statute">{{ $t('terms.statute') }}</v-tab>
          <v-tab value="privacy">{{ $t('privacyPolicy') }}</v-tab>
        </v-tabs>
        <v-icon class="closePopup" @click="showTerms = false">{{ ICON.X }}</v-icon>
      </div>
      <v-divider></v-divider>
      <v-window class="terms" v-model="tab">
        <v-window-item value="statute">
          <div v-html="statuteHtml"></div>
        </v-window-item>
        <v-window-item value="privacy">
          <div v-html="privacyHtml"></div>
        </v-window-item>
      </v-window>
    </div>
  </HubPopup>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .termsLabel {
    cursor: pointer;
  }

  .terms {
    padding: 12px;
    max-height: 80vh;
    overflow-y: scroll;
    position: relative;
  }

  .tabs {
    display: flex;
    justify-content: space-around;

    .v-btn {
      font-size: 12px !important;
    }

    .closePopup {
      font-size: 28px;
      color: $grayColor;
      margin: 12px 0;
    }
  }
</style>
