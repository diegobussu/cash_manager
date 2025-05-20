import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function HistoryButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate("history")}
      style={{ marginRight: 0, paddingRight: 0 }}
      hitSlop={10}
    >
      <MaterialCommunityIcons name="history" size={22} color="#0853A9" />
    </TouchableOpacity>
  );
}
