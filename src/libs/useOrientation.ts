import { ref, onMounted, onUnmounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useViewStore } from '@/stores/viewStore';

export function useOrientation() {
  const viewStore = useViewStore();
  const { isMobile } = storeToRefs(viewStore);
  const isLandscapeRaw = ref(false);

  const checkOrientation = () => {
    isLandscapeRaw.value = window.innerWidth > window.innerHeight;
  };

  const isLandscape = computed(() => isMobile.value && isLandscapeRaw.value);

  onMounted(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkOrientation);
    window.removeEventListener('orientationchange', checkOrientation);
  });

  return { isLandscape, isMobile };
}
