import { ref, onMounted, onBeforeUnmount } from "vue";

export function useFullscreen() {
  const isFullscreen = ref<boolean>(false);

  const enter = async (): Promise<void> => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("It was not possible to enter Fullscreen:", err);
      }
    }
  };

  const exit = async (): Promise<void> => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("It was not possible to leave Fullscreen:", err);
      }
    }
  };

  const onFullscreenChange = (): void => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  onMounted(() => {
    document.addEventListener("fullscreenchange", onFullscreenChange);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
  });

  return { isFullscreen, enter, exit };
}
