<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { ICON } from '@/enums/iconsEnum';
  import { Catalog } from '@/models/Catalog';
  import { useUserStore } from '@/stores/userStore';
  import { getAvatar } from '@/utils/imgUtils';

  const props = defineProps<{
    catalog: Catalog;
  }>();

  const emit = defineEmits<{
    (e: 'removeFollower', userId: number): void;
    (e: 'showRemoveFollowerPopup', userId: number): void;
  }>();

  const userStore = useUserStore();

  const followers = computed(() => props.catalog.followers);
  const showFollowers = ref(false);
  const removingFollowerUserId = ref<number | null>(null);

  watch(
    () => props.catalog.catalogId,
    () => {
      showFollowers.value = false;
    }
  );

  const getAvatarUrl = (avatarId: number) => {
    const avatar = userStore.avatars.find(a => a.id === avatarId);
    if (avatar) {
      return getAvatar(avatarId);
    }
    return null;
  };

  const requestRemoveFollower = (userId: number) => {
    emit('showRemoveFollowerPopup', userId);
  };

  defineExpose({
    removingFollowerUserId,
  });
</script>

<template>
  <div class="catalogFollowers">
    <div class="catalogFollowers_header" @click="showFollowers = !showFollowers">
      <span>{{ $t('catalog.savedInCollections') }}</span>
      <div class="catalogFollowers_header_right">
        <div class="catalogFollowers_badge">
          {{ followers.length ?? 0 }}
        </div>
        <v-icon :class="{ rotated: showFollowers }">{{ ICON.CHEVRON_UP }}</v-icon>
      </div>
    </div>
    <Transition name="followers">
      <div v-if="showFollowers" class="catalogFollowers_list">
        <template v-if="followers.length">
          <div v-for="follower in followers" :key="follower.userId" class="catalogFollowers_item">
            <div class="catalogFollowers_item_user">
              <div
                class="catalogFollowers_item_avatar"
                :class="{ hasAvatar: getAvatarUrl(follower.avatarId) }"
              >
                <img
                  v-if="getAvatarUrl(follower.avatarId)"
                  :src="getAvatarUrl(follower.avatarId)!"
                  :alt="follower.username"
                />
                <template v-else>
                  {{ follower.username.charAt(0).toUpperCase() }}
                </template>
              </div>
              <span>{{ follower.username }}</span>
            </div>
            <v-icon
              class="catalogFollowers_item_remove"
              :class="{ spinning: removingFollowerUserId === follower.userId }"
              @click="requestRemoveFollower(follower.userId)"
            >
              {{ ICON.DELETE }}
            </v-icon>
          </div>
        </template>
        <div v-else class="catalogFollowers_empty">
          {{ $t('catalog.noFollowers') }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .catalogFollowers {
    border-radius: 12px;
    background: rgba($lightBackground, 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba($darkBackground, 0.4);
    box-shadow: 0 2px 12px rgba($mainBrownColor, 0.06);

    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      font-weight: 500;
      color: $grayColor;
      transition: background 0.15s ease;

      &:hover {
        background: rgba($darkBackground, 0.15);
      }

      .v-icon {
        font-size: 18px;
        color: $lightGrayColor;
        transition: transform 0.2s ease;

        &.rotated {
          transform: rotate(180deg);
        }
      }
    }

    &_header_right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &_badge {
      background: $mainBrownColor;
      color: $whiteColor;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    &_list {
      border-top: 1px solid rgba($darkBackground, 0.3);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &_loader {
      display: flex;
      justify-content: center;
      padding: 12px;

      .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba($darkBackground, 0.4);
        border-top-color: $mainOrangeColor;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
    }

    &_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background 0.15s ease;

      &:hover {
        background: rgba($darkBackground, 0.15);
      }

      &_user {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      &_avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, $mainOrangeColor, $darkOrangeColor);
        color: $whiteColor;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;

        &.hasAvatar {
          background: $whiteColor;
          padding: 1px;
          box-shadow: rgba(0, 0, 0, 0.24) 0 2px 6px;
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: contain;
        }
      }

      span {
        font-size: 14px;
        color: $grayColor;
      }

      &_remove {
        font-size: 18px;
        color: $lightGrayColor;
        cursor: pointer;
        transition: color 0.15s ease;

        &:hover {
          color: $errorColor;
        }

        &.spinning {
          animation: spin 0.7s linear infinite;
        }
      }
    }

    &_empty {
      padding: 12px 8px;
      text-align: center;
      font-size: 13px;
      color: $lightGrayColor;
    }
  }

  .followers-enter-active,
  .followers-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    transform-origin: top;
  }

  .followers-enter-from,
  .followers-leave-to {
    opacity: 0;
    transform: scaleY(0.9) translateY(-4px);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
