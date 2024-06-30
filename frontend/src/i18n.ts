import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "./locales/en/lang.json";
import csLang from "./locales/cs/lang.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enLang },
        cs: { translation: csLang },
    },
    lng: "en",
    fallbackLng: "cs",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;