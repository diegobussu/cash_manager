import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useLocalization } from "../../../../utils/i18n";
import { AppText } from "@/components/AppText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LanguagesScreen() {
  const { locale, setLocale, t } = useLocalization();

  const languages = [
    {
      code: "en",
      name: t("english"),
      flag: "🇺🇸",
      description: "English (United States)",
    },
    {
      code: "fr",
      name: t("french"),
      flag: "🇫🇷",
      description: "Français (France)",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: t("language"),
        }}
      />

      <View className="px-4 pt-6 pb-4">
        <AppText bold size="heading">
          {t("language")}
        </AppText>
        <AppText color="secondary" size="small" className="mt-1">
          {t("languageDescription")}
        </AppText>
      </View>

      <View className="px-4">
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            className="rounded-xl p-5 mb-4 shadow-lg bg-white border border-gray-100"
            style={[
              { elevation: 3 },
              locale === lang.code && styles.selectedLanguage,
            ]}
            onPress={() => setLocale(lang.code)}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
                  <AppText size="medium">{lang.flag}</AppText>
                </View>
                <View>
                  <AppText
                    bold
                    className={locale === lang.code ? "text-blue-500" : ""}
                  >
                    {lang.name}
                  </AppText>
                  <AppText size="small" color="secondary">
                    {lang.description}
                  </AppText>
                </View>
              </View>

              {locale === lang.code && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#3498db"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="p-4 mt-6">
        <AppText color="secondary" size="small" className="text-center">
          {t("changeLanguageNote")}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLanguage: {
    borderColor: "#3498db",
    borderWidth: 2,
    backgroundColor: "#f0f8ff",
  },
});
