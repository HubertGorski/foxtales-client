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

// Service Worker Unregistration (Kill switch for old PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  // Optional: clear caches
  caches.keys().then(names => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}
