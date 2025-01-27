import { createI18n } from "vue-i18n";
import pl from "../locales/pl.json";
import en from "../locales/en.json";

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: "en",
  messages: { pl, en },
  legacy: false,
  globalInjection: true,
});

export default i18n;
