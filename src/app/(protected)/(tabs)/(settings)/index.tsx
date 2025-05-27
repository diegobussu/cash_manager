import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { AppText } from "@/components/AppText";
import UserService from "@/services/userService";
import { router } from "expo-router";
import { useLocalization } from "@/utils/i18n";

export default function IndexScreen() {
  const authState = useContext(AuthContext);
  const { t } = useLocalization();

  const handleDeleteAccount = async () => {
    Alert.alert(t("deleteAccount"), t("deleteAccountConfirmation"), [
      { text: t("cancel"), style: "destructive" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await UserService.deleteAccount();
            authState.logOut();
          } catch (error) {
            Alert.alert(t("error"), t("deleteAccountError"));
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#f4f6fb",
      }}
    >
      {/* Settings Options */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        {(
          [
            {
              icon: "shield-lock-outline",
              label: t("security"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/security"),
            },
            {
              icon: "credit-card-outline",
              label: t("managePaymentCards"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/credit-cards"),
            },
            {
              icon: "bell-outline",
              label: t("notifications"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/notifications"),
            },
            {
              icon: "translate",
              label: t("languages"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/languages"),
            },
            {
              icon: "information-outline",
              label: t("aboutUs"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/about-us"),
            },
            {
              icon: "star-outline",
              label: t("rateUs"),
              onPress: () =>
                router.navigate("/(protected)/(tabs)/(settings)/rate-us"),
            },
            {
              icon: "file-document-outline",
              label: t("privacyPolicy"),
              onPress: () =>
                router.navigate(
                  "/(protected)/(tabs)/(settings)/privacy-policy",
                ),
            },
          ] as {
            icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
            label: string;
            onPress: () => void;
          }[]
        ).map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 15,
              borderBottomWidth: index < 6 ? 1 : 0,
              borderBottomColor: "#e5e7eb",
            }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color="#0853A9"
            />
            <AppText size="medium" className="ml-4">
              {item.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={authState.logOut}
        style={{
          marginTop: 24,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <MaterialCommunityIcons name="logout" size={24} color="#0853A9" />
        <AppText size="medium" className="ml-4">
          {t("logout")}
        </AppText>
      </TouchableOpacity>

      {/* Delete Account */}
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={{
          marginTop: 16,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="#FF3B30"
        />
        <AppText size="medium" bold className="ml-4" color="danger">
          {t("deleteAccount")}
        </AppText>
      </TouchableOpacity>

      {/* Copyright */}
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <AppText size="small" color="tertiary" center>
          {t("copyright", { year: "2025", name: "Diego BUSSU" })}
        </AppText>
      </View>
    </ScrollView>
  );
}
