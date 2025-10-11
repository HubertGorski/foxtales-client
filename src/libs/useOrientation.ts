import { ref, onMounted, onUnmounted } from "vue";
import { useViewStore } from "@/stores/viewStore";

export function useOrientation() {
  const isMobile = useViewStore().getIsMobile();
  const isLandscape = ref(false);

  const checkOrientation = () => {
    isLandscape.value =
      isMobile && window.innerWidth > window.innerHeight;
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
