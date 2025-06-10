import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

// Import translations
import en from "../../locales/en.json";
import fr from "../../locales/fr.json";

// Initialize i18n object
const i18n = new I18n({
  en,
  fr,
});

// Set default locale
i18n.defaultLocale = "en";
i18n.enableFallback = true;

// Key for language storage
const LANGUAGE_KEY = "user-language";

// Create a context to manage language throughout the app
export const LocalizationContext = createContext({
  locale: Localization.locale.split("-")[0],
  setLocale: (locale: string) => {},
  t: (scope: string, options?: object) => "",
} as {
  locale: string;
  setLocale: (locale: string) => void;
  t: (scope: string, options?: object) => string;
});

// Hook to use the localization context
export const useLocalization = () => useContext(LocalizationContext);

// Localization provider
export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState(Localization.locale.split("-")[0]);

  // Load saved language on startup
  useEffect(() => {
    const loadSavedLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setLocale(savedLanguage);
      } else {
        // Use device language if no saved preference
        const deviceLanguage = Localization.locale.split("-")[0];
        const supportedLanguage = ["en", "fr"].includes(deviceLanguage)
          ? deviceLanguage
          : "en";
        setLocale(supportedLanguage);
      }
    };

    loadSavedLanguage();
  }, []);

  // Update i18n when language changes
  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  // Function to change language
  const setLocaleWrapper = async (newLocale: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, newLocale);
    setLocale(newLocale);
  };

  // Translation function
  const t = (scope: string, options?: object) => {
    return i18n.t(scope, options);
  };

  return (
    <LocalizationContext.Provider
      value={{ locale, setLocale: setLocaleWrapper, t }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
