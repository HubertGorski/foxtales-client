import { onMounted, onBeforeUnmount } from 'vue';

export function useDynamicHeight(selector: string) {
  let element: HTMLElement | null = null;

  const adjustHeight = () => {
    if (!element) return;
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    element.style.height = `${height}px`;
  };

  const onResize = () => adjustHeight();

  onMounted(() => {
    element = document.querySelector(selector);
    if (!element) return;

    adjustHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize);
    } else {
      window.addEventListener('resize', onResize);
    }
  });

  onBeforeUnmount(() => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', onResize);
    } else {
      window.removeEventListener('resize', onResize);
    }
  });
}
