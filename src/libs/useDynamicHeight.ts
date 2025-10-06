import { onMounted, onBeforeUnmount } from "vue";

/**
 * Hook do dynamicznego ustawiania wysokości elementu na widoczny viewport.
 * @param selector - CSS selector elementu, np. '#app' lub '.foxTales'
 */
export function useDynamicHeight(selector: string) {
  let element: HTMLElement | null = null;

  const adjustHeight = () => {
    if (!element) return;
    // visualViewport.height jest dynamiczne i uwzględnia klawiaturę
    const height = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;
    element.style.height = `${height}px`;
  };

  const onResize = () => adjustHeight();

  onMounted(() => {
    element = document.querySelector(selector);
    if (!element) return;

    adjustHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
    } else {
      window.addEventListener("resize", onResize);
    }
  });

  onBeforeUnmount(() => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onResize);
    } else {
      window.removeEventListener("resize", onResize);
    }
  });
}
