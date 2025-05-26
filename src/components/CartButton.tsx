import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function CartButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.navigate("product-modal")}>
      <MaterialCommunityIcons name="cart-plus" size={22} color="#0853A9" />
    </TouchableOpacity>
  );
}
