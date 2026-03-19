<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import HubBtn from './HubBtn.vue';
  import { ICON } from '@/enums/iconsEnum';
  import { platforms, type IPlatform } from '@/api/External';

  const props = defineProps({
    url: {
      type: String,
      default: () => window.location.href,
    },
    title: {
      type: String,
      default: () => document.title,
    },
    text: {
      type: String,
      default: '',
    },
  });

  const isOpen = ref(false);
  const copied = ref(false);

  const toggleMenu = () => {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator
        .share({
          title: props.title,
          text: props.text,
          url: props.url,
        })
        .catch(() => {});
      return;
    }
    isOpen.value = !isOpen.value;
  };

  const share = (platform: IPlatform) => {
    const shareUrl = platform.getUrl(props.url, props.title);
    window.open(shareUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
    isOpen.value = false;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(props.url);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = props.url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') isOpen.value = false;
  };

  onMounted(() => document.addEventListener('keydown', handleKeydown));
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="share-wrapper">
    <HubBtn text="share" :icon="ICON.SHARE" small useGap isOrange :action="toggleMenu" />
    <Transition name="share-menu">
      <div v-if="isOpen" class="share-menu">
        <button
          v-for="platform in platforms"
          :key="platform.name"
          class="share-item"
          :style="{ '--color': platform.color }"
          @click="share(platform)"
        >
          <span class="share-icon" v-html="platform.icon"></span>
          <span class="share-label">{{ platform.name }}</span>
        </button>

        <button class="share-item copy-btn" :style="{ '--color': '#6b7280' }" @click="copyLink">
          <span class="share-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="20"
              height="20"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </span>
          <span class="share-label">{{ copied ? $t('copied') : $t('copyLink') }}</span>
        </button>
      </div>
    </Transition>

    <!-- Overlay to close menu -->
    <div v-if="isOpen" class="overlay" @click="isOpen = false"></div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .share-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .share-menu {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: $whiteColor;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 180px;
    z-index: 1000;
  }

  .share-menu::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 7px solid transparent;
    border-top-color: white;
  }

  .share-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    text-align: left;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .share-item:hover {
    background: color-mix(in srgb, var(--color) 10%, white);
    color: var(--color);
  }

  .share-item:hover .share-icon svg {
    filter: brightness(0.9);
  }

  .share-icon {
    display: flex;
    align-items: center;
    width: 20px;
  }

  /* Transitions */
  .share-menu-enter-active,
  .share-menu-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .share-menu-enter-from,
  .share-menu-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(6px) scale(0.97);
  }

  /* Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }
</style>
