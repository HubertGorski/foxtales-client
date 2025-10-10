import { useViewStore } from "@/stores/viewStore";
import { computed, onMounted, onUnmounted } from "vue";
import { useDevice } from "./useDevice";

export function useKeyboardScrollControl() {
  const viewStore = useViewStore();
  const { isMobile } = useDevice();

  let initialArea = 0;
  let scrollListener: ((e: Event) => void) | undefined;
  let observer: ResizeObserver | undefined;

  function blockScroll(e: Event) {
    e.preventDefault();
  }

  function enableScroll(): void {
    if (scrollListener) {
      document.removeEventListener("touchmove", scrollListener, {
        passive: false,
      } as any);
      scrollListener = undefined;
    }
  }

  function disableScroll(): void {
    if (!scrollListener) {
      scrollListener = blockScroll;
      document.addEventListener("touchmove", scrollListener, {
        passive: false,
      } as any);
    }
  }

  function checkAreaChange(currentArea: number) {
    if (currentArea < initialArea && !viewStore.isKeyboardOpen) {
      viewStore.setIsKeyboardOpen(true);
      disableScroll();
    }

    if (currentArea >= initialArea && viewStore.isKeyboardOpen) {
      viewStore.setIsKeyboardOpen(false);
      enableScroll();
    }
  }

  onMounted(() => {
    if (!isMobile.value) {
      return;
    }

    const target = document.querySelector(".foxTales");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    initialArea = rect.width * rect.height;

    observer = new ResizeObserver(() => {
      const newRect = target.getBoundingClientRect();
      const currentArea = newRect.width * newRect.height;
      checkAreaChange(currentArea);
    });

    observer.observe(target);
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
    enableScroll();
  });

  return { isKeyboardOpen: computed(() => viewStore.isKeyboardOpen) };
}
