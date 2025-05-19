import { View, TouchableOpacity } from "react-native";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SecurityScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f6fb",
      }}
    >
      <View
        style={{
          marginTop: 24,
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
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}
        >
          <MaterialCommunityIcons name="lock-reset" size={24} color="#0853A9" />
          <AppText size="medium" className="ml-4">
            Update Password
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}
        >
          <MaterialCommunityIcons name="email-edit" size={24} color="#0853A9" />
          <AppText size="medium" className="ml-4">
            Update Email
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
