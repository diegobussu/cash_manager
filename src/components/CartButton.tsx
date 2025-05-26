import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

type CartButtonProps = {
  product?: string;
};

export default function CartButton({ product }: CartButtonProps) {
  const router = useRouter();

  const handlePress = () => {
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
    <TouchableOpacity onPress={handlePress}>
      <MaterialCommunityIcons name="cart-plus" size={22} color="#0853A9" />
    </TouchableOpacity>
  );
}
