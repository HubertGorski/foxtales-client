import { useUserStore } from "@/stores/userStore";
import { onMounted, onBeforeUnmount } from "vue";

export function useBeforeUnload() {
  const userStore = useUserStore();

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    sessionStorage.setItem("accessToken", userStore.user.accessToken);
    event.preventDefault();
    event.returnValue = "";
  }

  onMounted(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });
}
