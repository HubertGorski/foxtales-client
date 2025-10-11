import { ref, onMounted } from "vue";
import { useViewStore } from "@/stores/viewStore";

export function useDevice(): void {
  const isMobile = ref(false);
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const detectMobile = () => {
    if (typeof navigator === "undefined") {
      return;
    }

    isMobile.value = mobileRegex.test(navigator.userAgent);
    useViewStore().setIsMobile(isMobile.value);
  };

  onMounted(detectMobile);
}
