import { createRouter, createWebHistory } from 'vue-router';
import { ROUTE_NAME, ROUTE_PATH } from './routeEnums';
import HomeViewVue from '@/views/HomeView.vue';
import LoginViewVue from '@/views/LoginView.vue';
import RegisterViewVue from '@/views/RegisterView.vue';
import MenuViewVue from '@/views/MenuView.vue';
import SettingsViewVue from '@/views/SettingsView.vue';
import JoinGameViewVue from '@/views/JoinGameView.vue';
import LobbyViewVue from '@/views/LobbyView.vue';
import CreateGameViewVue from '@/views/CreateGameView.vue';
import LibraryViewVue from '@/views/LibraryView.vue';
import { useUserStore } from '@/stores/userStore';
import { ROLE } from '@/enums/rolesEnum';
import NoAccessViewVue from '@/views/NoAccessView.vue';
import { NO_ACCESS_REASON } from '@/enums/noAccessReasonEnum';
import { PERMISSION_GAME } from '@/enums/permissions';
import PsychGameView from '@/views/PsychGameView.vue';
import WelcomeViewVue from '@/views/WelcomeView.vue';
import TryWithoutAccountView from '@/views/TryWithoutAccountView.vue';
import { userService } from '@/api/services/UserService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutesWithAuth(),
});

function getRoutesWithAuth() {
  const publicRoutes = [
    ROUTE_NAME.LOGIN,
    ROUTE_NAME.REGISTER,
    ROUTE_NAME.TRY_WITHOUT_ACCOUNT,
    ROUTE_NAME.WELCOME,
    ROUTE_NAME.NO_ACCESS,
    ROUTE_NAME.HOME,
  ];

  return [
    {
      path: ROUTE_PATH.LOGIN,
      name: ROUTE_NAME.LOGIN,
      component: LoginViewVue,
    },
    {
      path: ROUTE_PATH.REGISTER,
      name: ROUTE_NAME.REGISTER,
      component: RegisterViewVue,
    },
    {
      path: ROUTE_PATH.TRY_WITHOUT_ACCOUNT,
      name: ROUTE_NAME.TRY_WITHOUT_ACCOUNT,
      component: TryWithoutAccountView,
    },
    {
      path: ROUTE_PATH.HOME,
      name: ROUTE_NAME.HOME,
      component: HomeViewVue,
    },
    {
      path: ROUTE_PATH.WELCOME,
      name: ROUTE_NAME.WELCOME,
      component: WelcomeViewVue,
    },
    {
      path: ROUTE_PATH.MENU,
      name: ROUTE_NAME.MENU,
      component: MenuViewVue,
    },
    {
      path: ROUTE_PATH.SETTINGS,
      name: ROUTE_NAME.SETTINGS,
      component: SettingsViewVue,
    },
    {
      path: ROUTE_PATH.JOIN_GAME,
      name: ROUTE_NAME.JOIN_GAME,
      component: JoinGameViewVue,
    },
    {
      path: ROUTE_PATH.LOBBY,
      name: ROUTE_NAME.LOBBY,
      component: LobbyViewVue,
    },
    {
      path: ROUTE_PATH.GAME_PSYCH,
      name: ROUTE_NAME.GAME_PSYCH,
      component: PsychGameView,
    },
    {
      path: ROUTE_PATH.CREATE_GAME,
      name: ROUTE_NAME.CREATE_GAME,
      component: CreateGameViewVue,
      meta: {
        requiredGameSelected: true,
      },
    },
    {
      path: ROUTE_PATH.LIBRARY,
      name: ROUTE_NAME.LIBRARY,
      component: LibraryViewVue,
      meta: {
        requiredGameSelected: true,
      },
    },
    {
      path: ROUTE_PATH.NO_ACCESS,
      name: ROUTE_NAME.NO_ACCESS,
      component: NoAccessViewVue,
    },
  ].map(route => {
    if (!publicRoutes.includes(route.name)) {
      route.meta = {
        ...((route.meta as any) || {}),
        requiresAuth: true,
      };
    }
    return route;
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin && !isAdmin()) {
    next({
      path: ROUTE_PATH.NO_ACCESS,
      query: { reason: NO_ACCESS_REASON.ADMIN_ONLY },
    });
  } else if (!isAuthenticated()) {
    const response = await userService.loginByToken();
    if (to.meta.requiresAuth && !response) {
      next({
        path: ROUTE_PATH.NO_ACCESS,
        query: { reason: NO_ACCESS_REASON.UNAUTHENTICATED },
      });
    } else {
      next();
    }
  } else if (to.meta.permission && !hasAccessToGame(to.meta.permission as PERMISSION_GAME)) {
    next({
      path: ROUTE_PATH.NO_ACCESS,
      query: { reason: NO_ACCESS_REASON.NO_PERMISSION_GAME },
    });
  } else {
    next();
  }
});

function isAdmin(): boolean {
  return useUserStore().user.role === ROLE.ADMIN;
}

function hasAccessToGame(permission: PERMISSION_GAME): boolean {
  return useUserStore().getPermissionByName(permission).isGameUnlocked;
}

function isAuthenticated(): boolean {
  return !!useUserStore().getAccessToken();
}

export default router;
