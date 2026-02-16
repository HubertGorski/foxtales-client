<script setup lang="ts">
  import { ICON } from '@/enums/iconsEnum';
  import HubTooltip from './hubComponents/HubTooltip.vue';
  import HubBtn from './hubComponents/HubBtn.vue';
  import TeamIcon from './TeamIcon.vue';

  const {
    imgSource,
    isSelected = false,
    isSelectedBold = false,
    text = '',
    sublabel = '',
    label = '',
    avatarLabel = '',
    tooltipText = '',
    showArrowsLabel = false,
    teamId = 0,
  } = defineProps<{
    imgSource: string;
    isSelected?: boolean;
    isSelectedBold?: boolean;
    text?: string;
    sublabel?: string;
    label?: string;
    avatarLabel?: string;
    tooltipText?: string;
    showArrowsLabel?: boolean;
    teamId?: number | null;
  }>();

  const emit = defineEmits<{
    (e: 'arrowLeftClicked'): void;
    (e: 'arrowRightClicked'): void;
  }>();

  const arrowLeftClicked = () => {
    emit('arrowLeftClicked');
  };

  const arrowRightClicked = () => {
    emit('arrowRightClicked');
  };
</script>

<template>
  <div
    class="userListElement"
    :class="{
      isSelected: isSelected,
      isSelectedBold: isSelectedBold,
      isTextNotAvailable: !text.length,
    }"
  >
    <HubTooltip :tooltipText="tooltipText" :tooltipDisabled="!tooltipText">
      <img :src="imgSource" alt="Lisek" class="userListElement_avatar" />
      <TeamIcon v-if="teamId" class="teamIcon" :teamId="teamId" />
    </HubTooltip>
    <div class="userListElement_content">
      <div v-if="text" class="userListElement_text">
        {{ text }}
      </div>
      <div class="userListElement_labels">
        <div class="position-relative">
          <div v-if="avatarLabel" class="whiteCard label" :class="{ avatarLabel: !text.length }">
            {{ avatarLabel }}
          </div>
        </div>
        <div class="pointLabels">
          <div v-if="sublabel" :key="sublabel" class="whiteCard label label-sub">
            {{ sublabel }}
          </div>
          <div v-if="label && !showArrowsLabel" class="whiteCard label">{{ label }}</div>
        </div>
        <div v-if="label && showArrowsLabel" class="labelContainer">
          <HubBtn :icon="ICON.ARROW_LEFT" :action="arrowLeftClicked" />
          <div class="whiteCard label">{{ label }}</div>
          <HubBtn :icon="ICON.ARROW_RIGHT" :action="arrowRightClicked" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .userListElement {
    display: flex;
    align-items: center;
    position: relative;
    padding: 12px;
    transition: all 0.4s;

    &.isTextNotAvailable {
      height: 92px;
      width: 92px;
    }

    &.isSelected {
      padding: 8px;
      transition: all 0.3s;

      .userListElement_text {
        font-size: 19px;
        transition: all 0.3s;
      }

      .userListElement_avatar {
        transform: scale(1.1);
        border: 2px solid $mainBrownColor;
        left: 0;
        top: 0;
        transition:
          top 0.3s,
          left 0.3s;
      }

      .teamIcon {
        left: 46px;
        top: 46px;
        transition:
          top 0.3s,
          left 0.3s;
      }
    }

    &.isSelected.isSelectedBold .userListElement_avatar {
      transform: scale(1.1);
      border: 4px solid $mainBrownColor;
      left: 0;
      top: 0;
      transition:
        top 0.3s,
        left 0.3s;
    }

    &_content {
      width: 100%;
    }

    &_text {
      font-size: 18px;
      color: $mainBrownColor;
      background-color: $background;
      padding: 12px 32px 12px 64px;
      border-radius: 12px;
      width: 100%;
      z-index: 1;
      text-align: center;
      overflow: hidden;
      box-shadow: rgb(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      transition: all 0.3s;
    }

    &_labels {
      display: flex;
      justify-content: space-between;

      .label {
        padding: 0 8px;
        margin: 4px 0;
        white-space: nowrap;
        min-width: 58px;
        max-width: 212px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-style: italic;
        color: $lightGrayColor;
        text-align: center;
        z-index: 2;

        &-sub {
          min-width: 42px;
          animation: slideIntoLabel 1s ease-in 0.5s forwards;
        }
      }

      .pointLabels {
        display: flex;
        gap: 2px;
      }

      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 100%;

        .label {
          font-size: 16px;
          padding: 2px 0;
          border-radius: 8px;
          font-style: normal;
          flex-grow: 1;
        }

        .hubBtn {
          padding: 4px;
          margin: 4px;
          max-width: 32px;
        }
      }

      .avatarLabel {
        position: absolute;
        top: 64px;
        left: 0;
      }
    }

    &_avatar {
      background-color: white;
      height: 64px;
      width: 64px;
      box-shadow: rgb(0, 0, 0, 0.24) 0 3px 8px;
      border-radius: 50%;
      padding: 2px;
      position: absolute;
      left: 8px;
      top: 4px;
      z-index: 2;
      transition:
        top 0.3s,
        left 0.3s;
    }

    .teamIcon {
      position: absolute;
      top: 48px;
      left: 50px;
      z-index: 2;
      transition:
        top 0.3s,
        left 0.3s;
    }
  }

  @keyframes slideIntoLabel {
    100% {
      transform: translateX(48px);
    }
  }
</style>
