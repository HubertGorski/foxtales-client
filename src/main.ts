import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'reflect-metadata';
import App from './App.vue';
import router from './router';
import vuetify from './configs/vuetify';
import i18n from './configs/i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@/assets/styles/hubStyles.scss';
import '@vuepic/vue-datepicker/dist/main.css';
import { setupInterceptors } from './api/Interceptors';
import { useUserStore } from './stores/userStore';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component('VueDatePicker', VueDatePicker);
app.use(i18n);

const userStore = useUserStore();
setupInterceptors(
  () => userStore.getAccessToken(),
  token => userStore.setAccessToken(token),
  error => userStore.setConnectionError(error)
);

app.mount('#app');
