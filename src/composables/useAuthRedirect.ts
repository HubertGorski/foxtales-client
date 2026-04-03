import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useViewStore } from '@/stores/viewStore';
import { useUserStore } from '@/stores/userStore';
import { ROUTE_PATH } from '@/router/routeEnums';
import { isMessenger } from '@/utils/userAgentUtils';

export function useAuthRedirect() {
  const route = useRoute();
  const router = useRouter();
  const viewStore = useViewStore();
  const userStore = useUserStore();

  /**
   * Main login/redirection logic, usually called on component mount.
   * Checks if user is already authenticated or if there's a redirectPath in the URL.
   */
  const handleOnMountedCleanup = () => {
    const { redirectPath: queryRedirectPath } = route.query;

    if (queryRedirectPath) {
      viewStore.setRedirectPath(queryRedirectPath as string);
    }

    if (userStore.user.accessToken) {
      performRedirect();
    } else if (queryRedirectPath && !isMessenger()) {
      const query = { ...route.query };
      delete query.redirectPath;
      router.replace({ query });
    }
  };

  /**
   * Finalizes the authentication flow by redirecting to the saved path or MENU.
   * Should be called after successful login, registration, or guest entry.
   */
  const performRedirect = () => {
    const { redirectPath, setRedirectPath } = viewStore;
    router.push(redirectPath || ROUTE_PATH.MENU);
    setRedirectPath(null);
  };

  onMounted(() => {
    handleOnMountedCleanup();
  });

  return {
    performRedirect,
  };
}
