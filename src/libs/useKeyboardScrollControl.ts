import { useViewStore } from '@/stores/viewStore';
import { onMounted, onUnmounted } from 'vue';

export function useKeyboardScrollControl(): void {
  const viewStore = useViewStore();

  let initialArea = 0;
  let observer: ResizeObserver | undefined;

  function updateKeyboardState(currentArea: number) {
    const isMobile = viewStore.getIsMobile();
    if (!isMobile) return;

    const reductionThreshold = 0.85;
    const isLikelyKeyboardOpen = currentArea < initialArea * reductionThreshold;

    if (isLikelyKeyboardOpen !== viewStore.isKeyboardOpen) {
      viewStore.setIsKeyboardOpen(isLikelyKeyboardOpen);
    }
  }

  onMounted(() => {
    const isMobile = viewStore.getIsMobile();
    if (!isMobile) return;

    const target = document.querySelector('.foxTales');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    initialArea = rect.width * rect.height;

    observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateKeyboardState(width * height);
      }
    });

    observer.observe(target);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
    viewStore.setIsKeyboardOpen(false);
  });
}
