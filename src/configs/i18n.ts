import { createI18n } from 'vue-i18n';
import pl from '../locales/pl.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';

const i18n = createI18n({
  locale: navigator.language.startsWith('pl') ? 'pl' : 'en',
  fallbackLocale: 'pl',
  messages: { pl, en, de, fr, es },
  legacy: false,
  globalInjection: true,
});

export default i18n;
