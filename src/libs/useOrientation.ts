import { ref, onMounted, onUnmounted } from "vue";

export function useOrientation() {
  const isLandscape = ref(false);
  const isMobile = ref(false);

  const checkOrientation = () => {
    const ua = navigator.userAgent;
    // proste wykrywanie mobile
    isMobile.value =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    isLandscape.value =
      isMobile.value && window.innerWidth > window.innerHeight;
  };

  onMounted(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkOrientation);
  });

  return { isLandscape, isMobile };
}
