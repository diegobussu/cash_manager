import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

// Import des traductions
import en from "../../locales/en.json";
import fr from "../../locales/fr.json";

// Initialisation de l'objet i18n
const i18n = new I18n({
  en,
  fr,
});

// Définir la locale par défaut
i18n.defaultLocale = "en";
i18n.enableFallback = true;

// Clé pour le stockage de la langue
const LANGUAGE_KEY = "user-language";

// Créer un context pour gérer la langue dans toute l'application
export const LocalizationContext = createContext({
  locale: Localization.locale.split("-")[0],
  setLocale: (locale: string) => {},
  t: (scope: string, options?: object) => "",
} as {
  locale: string;
  setLocale: (locale: string) => void;
  t: (scope: string, options?: object) => string;
});

// Hook pour utiliser le contexte de localisation
export const useLocalization = () => useContext(LocalizationContext);

// Provider pour la localisation
export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState(Localization.locale.split("-")[0]);

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    const loadSavedLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setLocale(savedLanguage);
      } else {
        // Utiliser la langue du système si pas de préférence sauvegardée
        const deviceLanguage = Localization.locale.split("-")[0];
        const supportedLanguage = ["en", "fr"].includes(deviceLanguage)
          ? deviceLanguage
          : "en";
        setLocale(supportedLanguage);
      }
    };

    loadSavedLanguage();
  }, []);

  // Mettre à jour i18n quand la langue change
  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  // Fonction pour changer la langue
  const setLocaleWrapper = async (newLocale: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, newLocale);
    setLocale(newLocale);
  };

  // Fonction de traduction
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
