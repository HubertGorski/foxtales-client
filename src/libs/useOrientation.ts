import { ref, onMounted, onUnmounted } from "vue";
import { useDevice } from "./useDevice";

export function useOrientation() {
  const { isMobile } = useDevice();
  const isLandscape = ref(false);

  const checkOrientation = () => {
    isLandscape.value = isMobile.value && window.innerWidth > window.innerHeight;
  };

  onMounted(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkOrientation);
  });

  return { isLandscape };
}
