import { ref } from "vue";

// Each call to useLoading() creates an independent ref — can be used multiple times in one view:
//   const { loading: loadingA, withLoading: withLoadingA } = useLoading();
//   const { loading: loadingB, withLoading: withLoadingB } = useLoading();
// withLoading sets loading=true before fn() and false in finally (even on error).
// Also includes a guard: if loading is already in progress, subsequent calls are ignored.
export function useLoading() {
  const loading = ref(false);

  async function withLoading<T>(fn: () => Promise<T>): Promise<T | undefined> {
    if (loading.value) return;
    loading.value = true;
    try {
      return await fn();
    } finally {
      loading.value = false;
    }
  }

  return { loading, withLoading };
}
