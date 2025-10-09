import { ref, onMounted, onUnmounted } from "vue";

export function useKeyboardScrollControl() {
  const isKeyboardOpen = ref(false);

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
    if (currentArea < initialArea && !isKeyboardOpen.value) {
      isKeyboardOpen.value = true;
      disableScroll();
    }

    if (currentArea >= initialArea && isKeyboardOpen.value) {
      isKeyboardOpen.value = false;
      enableScroll();
    }
  }

  onMounted(() => {
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

  return { isKeyboardOpen };
}
