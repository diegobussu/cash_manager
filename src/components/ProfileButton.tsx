import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/profile")}>
      <MaterialCommunityIcons name="account-circle" size={22} color="#007AFF" />
    </TouchableOpacity>
  );
}
