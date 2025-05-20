import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { AppText } from "@/components/AppText";
import UserService from "@/services/userService";
import { router } from "expo-router";

export default function IndexScreen() {
  const authState = useContext(AuthContext);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await UserService.deleteAccount();
              authState.logOut();
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again.",
              );
            }
          },
        },
      ],
    );
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
              label: "Security",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/security"),
            },
            {
              icon: "credit-card-outline",
              label: "Manage Payment Cards",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/credit-cards"),
            },
            {
              icon: "bell-outline",
              label: "Notifications",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/notifications"),
            },
            {
              icon: "translate",
              label: "Languages",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/languages"),
            },
            {
              icon: "information-outline",
              label: "About Us",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/about-us"),
            },
            {
              icon: "star-outline",
              label: "Rate Us",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/rate-us"),
            },
            {
              icon: "file-document-outline",
              label: "Privacy Policy",
              onPress: () =>
                router.push("/(protected)/(tabs)/(settings)/privacy-policy"),
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
          Logout
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
          Delete Account
        </AppText>
      </TouchableOpacity>

      {/* Copyright */}
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <AppText size="small" color="tertiary" center>
          *© 2025 Diego BUSSU*
        </AppText>
      </View>
    </ScrollView>
  );
}
