import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProductModal() {
  const { product } = useLocalSearchParams();
  const router = useRouter();
  const productData = product ? JSON.parse(product as string) : null;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // TODO: Add logic to add productData and quantity to cart
    // Example: addToCart(productData, quantity);
    router.back();
  };

  if (!productData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <AppText>No product data.</AppText>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
          onPress={() => router.back()}
        >
          <AppText>Close</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-black/40">
      <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md items-center">
        <AppText size="large" bold className="mb-2">
          {productData.name}
        </AppText>
        <AppText className="mb-4" color="secondary">
          Choose quantity
        </AppText>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-full"
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <MaterialCommunityIcons name="minus" size={24} color="#333" />
          </TouchableOpacity>
          <AppText size="large" bold className="mx-6">
            {quantity}
          </AppText>
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-full"
            onPress={() => setQuantity((q) => q + 1)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
            onPress={() => router.back()}
          >
            <AppText bold>Cancel</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
            onPress={handleAddToCart}
          >
            <AppText color="white" bold>
              Add to cart
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
