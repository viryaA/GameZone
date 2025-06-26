import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './en';
import id from './id';

const i18n = new I18n({
    id,
    en,
});

i18n.locale = getLocales()[0].languageCode;
i18n.fallbacks = true;

export default i18n;
