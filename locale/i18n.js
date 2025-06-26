import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './locales/en';
import id from './locales/id';

i18n.translations = {
    en,
    id,
};

i18n.locale = Localization.locale.startsWith('id') ? 'id' : 'en'; // auto set
i18n.fallbacks = true;

export default i18n;
