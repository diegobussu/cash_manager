import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { AppText } from "@/components/AppText";

export default function IndexScreen() {
  const authState = useContext(AuthContext);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Account deleted"),
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
              onPress: () => {},
            },
            { icon: "bell-outline", label: "Notifications", onPress: () => {} },
            {
              icon: "account-multiple-plus-outline",
              label: "Invite Friends",
              onPress: () => {},
            },
            { icon: "help-circle-outline", label: "FAQ", onPress: () => {} },
            {
              icon: "information-outline",
              label: "About Us",
              onPress: () => {},
            },
            { icon: "star-outline", label: "Rate Us", onPress: () => {} },
            {
              icon: "file-document-outline",
              label: "Privacy Policy",
              onPress: () => {},
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
              paddingVertical: 12,
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
    </ScrollView>
  );
}
