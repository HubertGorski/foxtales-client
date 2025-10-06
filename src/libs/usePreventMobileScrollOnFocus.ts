import { onMounted, onBeforeUnmount } from "vue";
export function usePreventMobileScrollOnFocus() {
  onMounted(() => {
    const handleFocus = () => {
      setTimeout(() => {
        if (window.visualViewport) {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    };

    document.addEventListener("focusin", handleFocus);

    onBeforeUnmount(() => {
      document.removeEventListener("focusin", handleFocus);
    });
  });
}
