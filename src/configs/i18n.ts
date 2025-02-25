import { createI18n } from "vue-i18n";
import pl from "../locales/pl.json";

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: "pl",
  messages: { pl },
  legacy: false,
  globalInjection: true,
});

export default i18n;
