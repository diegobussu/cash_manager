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
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddToCart = () => {
    addItem(productData, quantity);
    setSuccessMessage("Product added to cart !");
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
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4">
            {productData.image_url ? (
              <View className="w-12 h-12 rounded-xl overflow-hidden">
                <Image
                  src={productData.image_url}
                  alt={productData.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </View>
            ) : (
              <MaterialCommunityIcons name="food" size={32} color="#ccc" />
            )}
          </View>
          <View className="flex-1">
            <AppText bold size="heading">
              {productData.name}
            </AppText>
            <AppText color="secondary" size="small">
              {productData.brand}
            </AppText>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-gray-100 my-2" />

        {/* Quantity Selector */}
        <AppText className="mb-2" color="secondary">
          Choose quantity
        </AppText>
        <View className="flex-row items-center justify-center mb-6">
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

        {/* Price & Info */}
        <View className="flex-row justify-between items-center mb-4">
          <AppText color="secondary" size="small">
            Price
          </AppText>
          <AppText bold size="heading" color="primary">
            {productData.price
              ? `${(productData.price * quantity).toFixed(2)} €`
              : "N/A"}
          </AppText>
        </View>
        <View className="flex-row justify-between items-center mb-6">
          <AppText color="secondary" size="small">
            Barcode
          </AppText>
          <AppText size="small">{productData.bar_code || "N/A"}</AppText>
        </View>

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
