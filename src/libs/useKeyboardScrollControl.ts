import { ref, onMounted, onUnmounted } from "vue";

export function useKeyboardScrollControl() {
  const isKeyboardOpen = ref(false);
  let initialHeight = window.innerHeight;
  const keyboardHeight = 100;

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

  function handleKeyboardOpen() {
    disableScroll();
  }

  function handleKeyboardClose() {
    enableScroll();
  }

  function onKeyboardOpen() {
    if (!isKeyboardOpen.value) {
      isKeyboardOpen.value = true;
      handleKeyboardOpen();
    }
  }

  function onKeyboardClose() {
    if (isKeyboardOpen.value) {
      isKeyboardOpen.value = false;
      handleKeyboardClose();
    }
  }

  function checkKeyboard() {
    const currentHeight = window.innerHeight;
    const keyboardIsVisible = currentHeight < initialHeight - keyboardHeight;

    if (keyboardIsVisible) {
      onKeyboardOpen();
    } else {
      onKeyboardClose();
    }
  }

  onMounted(() => {
    window.addEventListener("resize", checkKeyboard);
    document.addEventListener("focusin", checkKeyboard);
    document.addEventListener("focusout", onKeyboardClose);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkKeyboard);
    document.removeEventListener("focusin", checkKeyboard);
    document.removeEventListener("focusout", onKeyboardClose);
    handleKeyboardClose();
  });

  return { isKeyboardOpen };
}
