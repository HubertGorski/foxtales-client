<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useUserStore } from '@/stores/userStore';
  import { computed, ref, watch } from 'vue';

  const showErrorPanel = ref<boolean>(false);
  const connectionError = computed(
    () => useSignalRStore().connectionError ?? useUserStore().connectionError
  );

  let timeoutId: ReturnType<typeof setTimeout>;
  watch(connectionError, () => {
    clearTimeout(timeoutId);
    showErrorPanel.value = false;

    if (connectionError.value) {
      timeoutId = setTimeout(() => {
        showErrorPanel.value = true;
      }, 500);
    }
  });
</script>

<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="connectionError"
      class="hubErrorPanel"
      :class="{ showErrorPanel: showErrorPanel }"
      @click="showErrorPanel = !showErrorPanel"
    >
      <v-icon>{{ ICON.ERROR }}</v-icon>
      <span>{{ $t(connectionError) }}</span>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';
  @import '@/assets/styles/hubAnimations';

  .hubErrorPanel {
    position: fixed;
    background-color: #b00020;
    color: white;
    z-index: 9999;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    margin: 4px;
    transition: all 0.4s;
    overflow: hidden;

    .v-icon {
      margin: 0 4px;
    }

    span {
      font-size: 12px;
      padding-left: 4px;
      text-wrap: nowrap;
    }

    &.showErrorPanel {
      width: 420px;
    }
  }
</style>
