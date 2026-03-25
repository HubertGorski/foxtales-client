import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue';

export function useAutoHeight(targetRef: any, isOpen: any) {
  const currentHeight = ref('0px');
  let resizeObserver: ResizeObserver | null = null;

  const setHeight = async () => {
    await nextTick();

    if (!targetRef.value) return;

    currentHeight.value = `${targetRef.value.scrollHeight}px`;
  };

  const initResizeObserver = () => {
    if (!targetRef.value) return;

    resizeObserver = new ResizeObserver(() => {
      if (isOpen.value) {
        setHeight();
      }
    });

    resizeObserver.observe(targetRef.value);
  };

  onMounted(() => {
    initResizeObserver();
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  watch(isOpen, val => {
    if (val) {
      setHeight();
    } else {
      currentHeight.value = '0px';
    }
  });

  return {
    currentHeight,
  };
}
