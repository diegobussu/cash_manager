import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

type CartButtonProps = {
  product?: string;
  disabled?: boolean;
};

export default function CartButton({ product, disabled }: CartButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (disabled) return;
    if (product) {
      router.navigate(
        `/(protected)/(tabs)/(products)/product-modal?product=${encodeURIComponent(
          product,
        )}`,
      );
    } else {
      router.navigate(`/(protected)/(tabs)/(products)/product-modal`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled}>
      <MaterialCommunityIcons
        name="cart-plus"
        size={22}
        color={disabled ? "#ccc" : "#0853A9"}
      />
    </TouchableOpacity>
  );
}
