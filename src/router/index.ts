import { createRouter, createWebHistory } from "vue-router";
import { ROUTE_NAME, ROUTE_PATH } from "./routeEnums";
import HomeViewVue from "@/views/HomeView.vue";
import LoginViewVue from "@/views/LoginView.vue";
import RegisterViewVue from "@/views/RegisterView.vue";
import MenuViewVue from "@/views/MenuView.vue";
import SettingsViewVue from "@/views/SettingsView.vue";
import JoinGameViewVue from "@/views/JoinGameView.vue";
import LobbyViewVue from "@/views/LobbyView.vue";
import CreateGameViewVue from "@/views/CreateGameView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: ROUTE_PATH.HOME,
      name: ROUTE_NAME.HOME,
      component: HomeViewVue,
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
      path: ROUTE_PATH.CREATE_GAME,
      name: ROUTE_NAME.CREATE_GAME,
      component: CreateGameViewVue,
    },
  ],
});

export default router;