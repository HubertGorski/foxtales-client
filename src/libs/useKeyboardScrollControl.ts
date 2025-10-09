import { ref, onMounted, onUnmounted } from "vue";

export function useKeyboardScrollControl() {
  const isKeyboardOpen = ref(false);

  let initialArea = 0;
  let scrollListener: ((e: Event) => void) | undefined;

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

  function checkScreenChange() {
    const currentArea = window.innerWidth * window.innerHeight;

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
    initialArea = window.innerWidth * window.innerHeight;
    window.addEventListener("resize", checkScreenChange);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkScreenChange);
    enableScroll();
  });

  return { isKeyboardOpen };
}
