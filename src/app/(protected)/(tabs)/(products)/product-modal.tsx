import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CartContext } from "@/utils/cartContext";

export default function ProductModal() {
  const { product } = useLocalSearchParams();
  const router = useRouter();
  const productData = product ? JSON.parse(product as string) : null;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useContext(CartContext);
  const [successMessage, setSuccessMessage] = useState(""); // Ajout

  const handleAddToCart = () => {
    addItem(productData, quantity);
    setSuccessMessage("Produit ajouté au panier !");
    setTimeout(() => {
      setSuccessMessage("");
      router.back();
    }, 1000);
  };

  if (!productData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <MaterialCommunityIcons name="cart-off" size={60} color="#cbd5e1" />
        <AppText color="secondary" className="mt-4 mb-2">
          No product data.
        </AppText>
        <TouchableOpacity
          className="mt-2 px-5 py-2 bg-blue-500 rounded-lg"
          onPress={() => router.back()}
        >
          <AppText color="white" bold>
            Close
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-black/40">
      <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
        {/* ...existing code... */}
        {/* Actions */}
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
            onPress={() => router.back()}
          >
            <AppText bold>Cancel</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 py-3 rounded-lg items-center ml-4"
            onPress={handleAddToCart}
          >
            <AppText color="white" bold>
              Add to cart
            </AppText>
          </TouchableOpacity>
        </View>
        {successMessage ? (
          <AppText size="small" center bold color="success" className="mt-4">
            {successMessage}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}
