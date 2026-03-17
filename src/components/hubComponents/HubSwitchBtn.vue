<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({
    initState: {
      type: Boolean,
      required: false,
    },
    iconOff: {
      type: String,
      required: true,
    },
    iconOn: {
      type: String,
      required: true,
    },
    iconSize: {
      type: String,
      required: false,
    },
    action: {
      type: Function,
      required: true,
    },
    isOrange: {
      type: Boolean,
      default: false,
    },
  });

  const isActive = ref(props.initState);

  const handleAction = () => {
    isActive.value = !isActive.value;
    props.action();
  };
</script>

<template>
  <div class="hubSwitchBtn" :class="{ isActive, isOrange }" @click="handleAction">
    <transition name="fade2" mode="out-in">
      <v-icon :key="isActive ? 1 : 0" :style="{ fontSize: `${iconSize}px` }">
        {{ isActive ? iconOff : iconOn }}
      </v-icon>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/hubAnimations' as *;

  .hubSwitchBtn {
    background-color: $mainBrownColor;
    cursor: pointer;
    color: $whiteColor;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 2px 4px rgb(0, 0, 0, 0.1);
    border: 1px solid rgb(84, 50, 47, 0.15);
    transition: all 0.2s;
    height: 48px;
    width: 48px;

    .v-icon {
      font-size: 48px;
    }

    &.isOrange {
      background-color: $mainOrangeColor;
      box-shadow:
        0 4px 8px rgb(252, 152, 40, 0.3),
        0 2px 4px rgb(0, 0, 0, 0.1);
    }

    &.isActive {
      background-color: $lightBrownColor;
      transition: all 0.2s;

      &.isOrange {
        background-color: $darkerOrangeColor;
      }
    }
  }
</style>
