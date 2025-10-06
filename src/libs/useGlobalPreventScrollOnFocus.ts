import { onMounted, onBeforeUnmount } from "vue";
export function useGlobalPreventScrollOnFocus() {
  onMounted(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        target.focus({ preventScroll: true });
      }
    };

    document.addEventListener("focusin", handleFocusIn);

    onBeforeUnmount(() => {
      document.removeEventListener("focusin", handleFocusIn);
    });
  });
}
