<script setup lang="ts">
  import { ref } from 'vue';
  import { ICON } from '@/enums/iconsEnum';
  import HubSwitch from '@/components/hubComponents/HubSwitch.vue';
  import { psychService } from '@/api/services/PsychService';

  const props = defineProps<{
    catalogId: number | null;
  }>();

  const hasPublicLink = defineModel<boolean>('hasPublicLink', { default: false });
  const shareKey = defineModel<string>('shareKey', { default: '' });

  const linkCopied = ref(false);
  const isRegenerating = ref(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareKey.value);
    linkCopied.value = true;
    setTimeout(() => (linkCopied.value = false), 2000);
  };

  const regenerateShareKey = async () => {
    if (isRegenerating.value) return;

    isRegenerating.value = true;
    try {
      shareKey.value = await psychService.regenerateShareKey(props.catalogId ?? 0);
    } finally {
      isRegenerating.value = false;
    }
  };

  const onSwitchChange = async (value: boolean | null) => {
    if (value && !props.catalogId) {
      shareKey.value = await psychService.generateShareKey();
    }
  };
</script>

<template>
  <div class="catalogShareLink">
    <HubSwitch
      v-model="hasPublicLink"
      :tooltipText="$t('catalog.shareLinkTooltip')"
      :label="$t('catalog.shareViaLink')"
      withIcon
      @onSwitchChange="onSwitchChange"
    />
    <div v-if="hasPublicLink" class="catalogShareLink_link" @click="copyLink">
      <div class="catalogShareLink_link_key">{{ shareKey }}</div>
      <div class="catalogShareLink_link_actions">
        <v-icon
          v-if="catalogId"
          class="catalogShareLink_link_actions_refresh"
          :class="{ spinning: isRegenerating }"
          @click.stop="regenerateShareKey"
        >
          {{ ICON.REFRESH }}
        </v-icon>
        <v-icon>{{ linkCopied ? ICON.CHECK : ICON.COPY }}</v-icon>
      </div>
    </div>
    <Transition name="toast">
      <div v-if="linkCopied" class="catalogShareLink_toast">
        {{ $t('catalog.linkCopied') }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .catalogShareLink {
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba($lightBackground, 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba($darkBackground, 0.4);
    box-shadow: 0 2px 12px rgba($mainBrownColor, 0.06);
    transition: box-shadow 0.2s ease;

    &:has(.catalogShareLink_link:hover) {
      box-shadow: 0 4px 20px rgba($mainOrangeColor, 0.15);
    }

    &_link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba($whiteColor, 0.6);
      border: 1px solid rgba($darkBackground, 0.25);
      cursor: pointer;

      &_key {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: $lightGrayColor;
        letter-spacing: 0.01px;
      }

      &_actions {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;

        .v-icon {
          font-size: 20px;
          color: $lightGrayColor;
          transition: color 0.15s ease;

          &:hover {
            color: $mainBrownColor;
          }
        }

        &_refresh.spinning {
          animation: spin 0.7s linear infinite;
        }
      }
    }

    &_toast {
      margin-top: 8px;
      padding: 7px 12px;
      border-radius: 8px;
      background: rgba($mainBrownColor, 0.88);
      color: $whiteColor;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      backdrop-filter: blur(6px);
    }
  }

  .toast-enter-active,
  .toast-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
