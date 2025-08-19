<script setup lang="ts">
const props = defineProps({
  imgSource: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isSelectedBold: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  avatarLabel: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div
    class="userListElement"
    :class="{ isSelected: isSelected, isSelectedBold: isSelectedBold }"
  >
    <img :src="imgSource" alt="Lisek" class="userListElement_avatar" />
    <div class="userListElement_content">
      <div class="userListElement_text">
        {{ text }}
      </div>
      <div class="userListElement_labels">
        <div>
          <div v-if="avatarLabel" class="whiteCard label">
            {{ avatarLabel }}
          </div>
        </div>
        <div v-if="label" class="whiteCard label">{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";
.userListElement {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 12px;
  transition: all 0.4s;

  &.isSelected {
    transform: scale(1.06);
    transition: all 0.4s;

    .userListElement_avatar {
      transform: scale(1.1);
      border: 2px solid $mainBrownColor;
    }
  }

  &.isSelected.isSelectedBold .userListElement_avatar {
    transform: scale(1.1);
    border: 4px solid $mainBrownColor;
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
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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
    }
  }

  &_avatar {
    background-color: white;
    height: 64px;
    width: 64px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border-radius: 50%;
    padding: 2px;
    position: absolute;
    left: 8px;
    top: 4px;
    z-index: 2;
  }
}
</style>
