<script setup lang="ts">
  import { ROUTE_PATH } from '@/router/routeEnums';
  import HubBtn from './hubComponents/HubBtn.vue';
  import { useRouter } from 'vue-router';
  import HubTooltip from './hubComponents/HubTooltip.vue';
  import { computed } from 'vue';
  const router = useRouter();

  const props = defineProps({
    isColumnDirection: {
      type: Boolean,
      default: false,
    },
    btnCustomAction: {
      type: Function,
      required: false,
    },
    btn2CustomAction: {
      type: Function,
      required: false,
    },
    btn: {
      type: String,
      required: true,
    },
    btn2: {
      type: String,
      required: false,
    },
    btnIsOrange: {
      type: Boolean,
      default: null,
    },
    btn2isOrange: {
      type: Boolean,
      default: null,
    },
    btnDisabled: {
      type: Boolean,
      default: false,
    },
    btn2Disabled: {
      type: Boolean,
      default: false,
    },
    btnTooltipText: {
      type: String,
      default: '',
    },
    btn2TooltipText: {
      type: String,
      default: '',
    },
    btn2isClicked: {
      type: Boolean,
      default: false,
    },
  });

  const allBtns = [
    {
      text: 'back',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.MENU),
    },
    {
      text: 'back2',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.MENU),
    },
    {
      text: 'shop',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.MENU),
    },
    {
      text: 'settings',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.SETTINGS),
    },
    {
      text: 'logout',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.HOME),
    },
    {
      text: 'goToLogin',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.LOGIN),
    },
    {
      text: 'register',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.REGISTER),
    },
    {
      text: 'next',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.LOBBY),
    },
    {
      text: 'start',
      isOrange: true,
      action: () => router.push(ROUTE_PATH.LOBBY),
    },
    {
      text: 'closeGame',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.MENU),
    },
    {
      text: 'accept',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.LOBBY),
    },
    {
      text: 'ready',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.LOBBY),
    },
    {
      text: 'leaveGame',
      isOrange: false,
      action: () => router.push(ROUTE_PATH.LOBBY),
    },
  ];

  const selectedBtn = computed(() => {
    const btn = allBtns.find(btn => btn.text === props.btn);
    if (!btn) return { text: '', isOrange: false, action: () => {} };

    const result = { ...btn };
    if (typeof props.btnCustomAction === 'function') {
      result.action = () => props.btnCustomAction!();
    }
    if (props.btnIsOrange != null) {
      result.isOrange = props.btnIsOrange;
    }
    return result;
  });

  const selectedBtn2 = computed(() => {
    if (!props.btn2) return null;
    const btn = allBtns.find(btn => btn.text === props.btn2);
    if (!btn) return null;

    const result = { ...btn };
    if (typeof props.btn2CustomAction === 'function') {
      result.action = () => props.btn2CustomAction!();
    }
    if (props.btn2isOrange != null) {
      result.isOrange = props.btn2isOrange;
    }
    return result;
  });

  const isTooltip2Visible = computed(() => !!selectedBtn2.value && props.btn2Disabled);
</script>

<template>
  <div class="navigationBtns" :class="{ isColumnDirection: isColumnDirection }">
    <HubTooltip :tooltipText="btnTooltipText" :tooltipDisabled="!btnDisabled" maxWidth>
      <HubBtn
        class="navigationBtns_btn"
        :action="selectedBtn.action"
        :text="selectedBtn.text"
        :isOrange="selectedBtn.isOrange"
        :disabled="btnDisabled"
      />
    </HubTooltip>
    <HubTooltip
      v-if="selectedBtn2"
      :tooltipText="btn2TooltipText"
      :tooltipDisabled="!isTooltip2Visible"
      maxWidth
    >
      <HubBtn
        class="navigationBtns_btn"
        :action="selectedBtn2.action"
        :text="selectedBtn2.text"
        :isOrange="selectedBtn2.isOrange"
        :disabled="btn2Disabled"
        :isClicked="btn2isClicked"
      />
    </HubTooltip>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .navigationBtns {
    display: flex;
    gap: 8px;
    width: 100%;

    &_btn {
      padding: 8px 12px;
      margin: 0 auto;
    }

    &.isColumnDirection {
      flex-direction: column;
    }
  }
</style>
