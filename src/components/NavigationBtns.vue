<script setup lang="ts">
import { ROUTE_PATH } from "@/router/routeEnums";
import HubBtn from "./hubComponents/HubBtn.vue";
import { useRouter } from "vue-router";
import HubTooltip from "./hubComponents/HubTooltip.vue";
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
    default: "",
  },
  btn2TooltipText: {
    type: String,
    default: "",
  },
  btn2isSwitch: {
    type: Boolean,
    default: false,
  },
});

const allBtns = [
  {
    text: "back",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    text: "back2",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    text: "shop",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    text: "settings",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.SETTINGS),
  },
  {
    text: "logout",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.HOME), // TODO: naprawic revoke tokenu
  },
  {
    text: "goToLogin",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOGIN),
  },
  {
    text: "next",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
  {
    text: "start",
    isOrange: true,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
  {
    text: "closeGame",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU),
  },
  {
    text: "accept",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
  {
    text: "ready",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
  {
    text: "leaveGame",
    isOrange: false,
    action: () => router.push(ROUTE_PATH.LOBBY),
  },
];

const selectedBtn = allBtns.find((btn) => btn.text === props.btn)!;
if (typeof props.btnCustomAction === "function") {
  selectedBtn.action = () => props.btnCustomAction!();
}

const selectedBtn2 = props.btn2
  ? allBtns.find((btn) => btn.text === props.btn2)!
  : null;

if (selectedBtn2 && typeof props.btn2CustomAction === "function") {
  selectedBtn2.action = () => props.btn2CustomAction!();
}

if (props.btnIsOrange != null) {
  selectedBtn.isOrange = props.btnIsOrange;
}

if (props.btn2isOrange != null && selectedBtn2) {
  selectedBtn2.isOrange = props.btn2isOrange;
}

const isTooltip2Visible = !!selectedBtn2 && !props.btn2Disabled;
</script>

<template>
  <div class="navigationBtns" :class="{ isColumnDirection: isColumnDirection }">
    <HubTooltip
      :tooltipText="btnTooltipText"
      :tooltipDisabled="!btnDisabled"
      maxWidth
    >
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
      :tooltipDisabled="isTooltip2Visible"
      maxWidth
    >
      <HubBtn
        class="navigationBtns_btn"
        :action="selectedBtn2.action"
        :text="selectedBtn2.text"
        :isOrange="selectedBtn2.isOrange"
        :disabled="btn2Disabled"
        :isSwitch="btn2isSwitch"
      />
    </HubTooltip>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

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
