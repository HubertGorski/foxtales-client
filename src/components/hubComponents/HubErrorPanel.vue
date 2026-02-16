<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import { useSignalRStore } from '@/stores/signalRStore';
  import { useUserStore } from '@/stores/userStore';
  import { useViewStore } from '@/stores/viewStore';
  import { computed, ref, watch } from 'vue';

  const expandedIds = ref<Set<string | number>>(new Set());

  const notifications = computed(() => {
    const list = [];

    const signalError = useSignalRStore().connectionError;
    if (signalError) {
      list.push({ id: 'signalr', text: signalError, isInfo: false });
    }

    const userError = useUserStore().connectionError;
    if (userError) {
      list.push({ id: 'user', text: userError, isInfo: false });
    }

    useViewStore().infos.forEach(info => {
      list.push({ id: info.id, text: info.text, isInfo: true });
    });

    return list;
  });

  watch(
    notifications,
    newList => {
      newList.forEach(notif => {
        if (!expandedIds.value.has(notif.id)) {
          setTimeout(() => {
            expandedIds.value.add(notif.id);
          }, 500);
        }
      });

      const currentIds = new Set<string | number>(newList.map(n => n.id));
      expandedIds.value.forEach(id => {
        if (!currentIds.has(id)) {
          expandedIds.value.delete(id);
        }
      });
    },
    { deep: true, immediate: true }
  );

  const toggleExpand = (id: string | number) => {
    if (expandedIds.value.has(id)) {
      expandedIds.value.delete(id);
    } else {
      expandedIds.value.add(id);
    }
  };
</script>

<template>
  <div class="hubErrorPanelContainer">
    <transition-group name="list" tag="div">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="hubErrorPanel"
        :class="{ showErrorPanel: expandedIds.has(notif.id), isInfo: notif.isInfo }"
        @click="toggleExpand(notif.id)"
      >
        <v-icon>{{ notif.isInfo ? ICON.INFO : ICON.ERROR }}</v-icon>
        <span>{{ $t(notif.text) }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/hubAnimations' as *;

  .hubErrorPanelContainer {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
  }

  .hubErrorPanel {
    background-color: #b00020;
    color: white;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    transition: all 0.4s;
    overflow: hidden;
    pointer-events: auto;
    margin-bottom: 8px;

    &.isInfo {
      background-color: $lightBrownColor;
    }

    .v-icon {
      margin: 0 4px;
    }

    span {
      font-size: 12px;
      padding-left: 4px;
      text-wrap: nowrap;
    }

    &.showErrorPanel {
      width: min(420px, calc(100vw - 16px));
    }
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
</style>
