<script setup lang="ts">
  import { computed } from 'vue';
  import HubPopup from './hubComponents/HubPopup.vue';

  const selectedCatalogId = defineModel<number | null>({
    required: false,
    default: null,
  });

  const emit = defineEmits<{
    (e: 'setSelectedCatalogId', value: null): void;
  }>();

  const selectCatalog = () => {
    emit('setSelectedCatalogId', null);
  };

  const isCatalogDetailsVisible = computed({
    get: () => !!selectedCatalogId.value,
    set: value => {
      if (!value) {
        selectedCatalogId.value = null;
        selectCatalog();
      }
    },
  });
</script>

<template>
  <div class="catalogDetails">
    <HubPopup v-model="isCatalogDetailsVisible">
      <div class="creamCard">{{ selectedCatalogId }}</div>
    </HubPopup>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .catalogDetails {
  }
</style>
