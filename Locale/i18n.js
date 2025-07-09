import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './en';
import id from './id';

const i18n = new I18n({
    id,
    in: id,
    en,
});

i18n.locale = getLocales()[0].languageCode;
// console.log(i18n.locale);
i18n.fallbacks = true;

export default i18n;
