import { ref, onMounted, onUnmounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewStore } from '@/stores/viewStore';

export function useOrientation() {
  const viewStore = useViewStore();
  const { isMobile } = storeToRefs(viewStore);
  const isLandscapeRaw = ref(false);

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const mediaQuery = window.matchMedia('(orientation: landscape)');

  const checkOrientation = () => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      const orientation = window.screen?.orientation?.type;

      isLandscapeRaw.value = orientation ? orientation.startsWith('landscape') : mediaQuery.matches;
    }, 100);
  };

  onMounted(() => {
    checkOrientation();

    window.screen?.orientation?.addEventListener('change', checkOrientation);
    mediaQuery.addEventListener('change', checkOrientation);
  });

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout);

    window.screen?.orientation?.removeEventListener('change', checkOrientation);
    mediaQuery.removeEventListener('change', checkOrientation);
  });

  const isLandscape = computed(() => isMobile.value && isLandscapeRaw.value);

  return { isLandscape, isMobile };
}
