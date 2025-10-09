import { ref, onMounted, onUnmounted } from "vue";

export function useKeyboardScrollControl() {
  const isKeyboardOpen = ref(false);

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

  function onKeyboardOpen() {
    if (!isKeyboardOpen.value) {
      isKeyboardOpen.value = true;
      disableScroll();
    }
  }

  function onKeyboardClose() {
    if (isKeyboardOpen.value) {
      isKeyboardOpen.value = false;
      enableScroll();
    }
  }

  function handleFocusIn(e: FocusEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      onKeyboardOpen();
    }
  }

  function handleFocusOut(e: FocusEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      onKeyboardClose();
    }
  }

  onMounted(() => {
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
  });

  onUnmounted(() => {
    document.removeEventListener("focusin", handleFocusIn);
    document.removeEventListener("focusout", handleFocusOut);
    enableScroll();
  });

  return { isKeyboardOpen };
}
