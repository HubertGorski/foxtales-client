import { ref, onMounted } from "vue";

export function useDevice() {
  const isMobile = ref(false);
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const detectMobile = () => {
    if (typeof navigator === "undefined") {
      return;
    }

    isMobile.value = mobileRegex.test(navigator.userAgent);
  };

  onMounted(detectMobile);
  return { isMobile };
}
