import { useLocalSearchParams, useRouter } from "expo-router";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Product } from "@/models/Product";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Utils from "@/utils/Utils";

export default function ProductDetailsScreen() {
  const { product } = useLocalSearchParams();
  const router = useRouter();
  const productData: Product = JSON.parse(product as string);

  const handleAddToCart = () => {
    router.navigate(
      `/(protected)/(tabs)/(products)/product-modal?product=${encodeURIComponent(
        JSON.stringify(productData),
      )}`,
    );
  };

  return (
    <ScrollView className="bg-gray-100" showsVerticalScrollIndicator={false}>
      <View className="h-60 items-center justify-center bg-white">
        {productData.image_url ? (
          <Image
            source={{ uri: productData.image_url }}
            className="mt-4 w-[200] h-[200]"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-gray-200">
            <MaterialCommunityIcons name="food" size={80} color="#ccc" />
          </View>
        )}
      </View>

      <View className="p-4 bg-white rounded-t-3xl -mt-5">
        <AppText size="heading" bold center>
          {productData.name}
        </AppText>
        <AppText size="medium" color="secondary" center className="mb-6">
          {productData.brand}
        </AppText>

        <View className="mb-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl py-3"
            style={{
              backgroundColor: "#0853A9",
            }}
            activeOpacity={0.8}
            onPress={handleAddToCart}
          >
            <MaterialCommunityIcons name="cart-plus" size={24} color="#fff" />
            <AppText color="white" bold className="ml-2">
              Add to cart
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Basic Info Section */}
        <View className="mb-6 bg-white rounded-lg p-4 shadow">
          <View className="flex-row pb-3 mb-3 border-b border-gray-200">
            <MaterialCommunityIcons
              name="information"
              size={22}
              color="#0853A9"
            />
            <AppText size="large" bold className="ml-2">
              Basic Information
            </AppText>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <AppText size="small" color="secondary" className="w-1/3">
              Barcode
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.bar_code}
            </AppText>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <AppText size="small" color="secondary" className="w-1/3">
              Manufacturing
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.manufacturing_country || "N/A"}
            </AppText>
          </View>

          <View className="flex-row justify-between py-2">
            <AppText size="small" color="secondary" className="w-1/3">
              Quantity
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.quantity || "N/A"}
            </AppText>
          </View>

          <View className="flex-row justify-between py-2 border-t border-gray-100">
            <AppText size="small" color="secondary" className="w-1/3">
              Price
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.price ? `${productData.price} €` : "N/A"}
            </AppText>
          </View>
        </View>

        {/* Nutrition Section */}
        <View className="mb-6 bg-white rounded-lg p-4 shadow">
          <View className="flex-row pb-3 mb-3 border-b border-gray-200">
            <MaterialCommunityIcons
              name="food-apple"
              size={22}
              color="#0853A9"
            />
            <AppText size="large" bold className="ml-2">
              Nutrition Facts
            </AppText>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Energy
              </AppText>
              <AppText size="medium" bold>
                {productData.energy || "0"} kcal
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Fat
              </AppText>
              <AppText size="medium" bold>
                {productData.fat || "0"} g
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Saturated Fat
              </AppText>
              <AppText size="medium" bold>
                {productData.saturated_fat || "0"} g
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Carbohydrates
              </AppText>
              <AppText size="medium" bold>
                {productData.carbohydrates || "0"} g
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Sugars
              </AppText>
              <AppText size="medium" bold>
                {productData.sugars || "0"} g
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Proteins
              </AppText>
              <AppText size="medium" bold>
                {productData.proteins || "0"} g
              </AppText>
            </View>

            <View className="w-[48%] p-3 mb-3 bg-gray-100 rounded-lg">
              <AppText size="small" color="secondary">
                Salt
              </AppText>
              <AppText size="medium" bold>
                {productData.salt || "0"} g
              </AppText>
            </View>
          </View>
        </View>

        {/* Ingredients & Allergens */}
        <View className="mb-6 bg-white rounded-lg p-4 shadow">
          <View className="flex-row pb-3 mb-3 border-b border-gray-200">
            <MaterialCommunityIcons name="flask" size={22} color="#0853A9" />
            <AppText size="large" bold className="ml-2">
              Composition
            </AppText>
          </View>

          <View className="mb-4 pb-4 border-b border-gray-100">
            <AppText size="medium" bold>
              Ingredients
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.ingredients || "No ingredients data available"}
            </AppText>
          </View>

          <View className="mb-4 pb-4 border-b border-gray-100">
            <AppText size="medium" bold>
              Allergens
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.allergens || "No allergen data available"}
            </AppText>
          </View>

          <View className="mb-4 pb-4 border-b border-gray-100">
            <AppText size="medium" bold>
              Additives
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.additives || "No additives data available"}
            </AppText>
          </View>

          <View>
            <AppText size="medium" bold>
              Labels
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.labels || "No labels data available"}
            </AppText>
          </View>
        </View>

        {/* Footer Info */}
        <View className="mt-2 mb-5 items-center">
          <AppText size="small" color="tertiary">
            Product ID: {productData.id}
          </AppText>
          <AppText size="small" color="tertiary">
            Created: {Utils.formatDate(productData.createdAt)}
          </AppText>
          <AppText size="small" color="tertiary">
            Last updated: {Utils.formatDate(productData.updatedAt)}
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}
