import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import ProductService from "@/services/productService";
import { Product } from "@/models/Product";
import { AppText } from "@/components/AppText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

export default function IndexScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const fetchProducts = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getProductByQuery(searchQuery, 1, 20);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      Alert.alert("Error", err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  const handleSearch = () => {
    setSearching(true);
    fetchProducts(query).finally(() => setSearching(false));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="rounded-xl p-5 mb-4 shadow-lg bg-white border border-gray-100 flex-row items-center"
      style={{ elevation: 3 }}
      onPress={() =>
        router.navigate({
          pathname: "/(protected)/(tabs)/(products)/product",
          params: { product: JSON.stringify(item) },
        })
      }
      activeOpacity={0.7}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          className="w-14 h-14 rounded-lg mr-4 bg-gray-100"
        />
      ) : (
        <View className="w-14 h-14 rounded-lg mr-4 bg-gray-100 items-center justify-center">
          <MaterialCommunityIcons name="food" size={32} color="#ccc" />
        </View>
      )}
      <View className="flex-1">
        <AppText bold size="heading">
          {item.name}
        </AppText>
        <AppText color="secondary" size="small" className="mb-1">
          {item.brand}
        </AppText>
        <AppText bold color="primary">
          {item.price ? `${item.price} €` : "N/A"}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <MaterialCommunityIcons name="food-off" size={70} color="#cbd5e1" />
      <AppText color="secondary" className="mt-4 text-center">
        No products found
      </AppText>
      <TouchableOpacity
        className="mt-4 px-5 py-2 bg-blue-500 rounded-lg"
        onPress={handleSearch}
      >
        <AppText color="white" bold>
          Refresh
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-4">
        <AppText bold size="heading">
          Products
        </AppText>
        <AppText color="secondary" size="small" className="mt-1">
          Search and browse your products
        </AppText>
        <View className="flex-row items-center mt-4 bg-white rounded-lg px-3 py-2 shadow">
          <MaterialCommunityIcons name="magnify" size={24} color="#888" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Search products..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searching ? (
            <ActivityIndicator size="small" color="#3498db" />
          ) : (
            <TouchableOpacity onPress={handleSearch}>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#3498db"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && products.length === 0 ? (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#3498db" />
          <AppText color="secondary" className="mt-4">
            Loading products...
          </AppText>
        </View>
      ) : error && products.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={50}
            color="#f87171"
          />
          <AppText color="danger" className="mb-2 mt-4 text-center">
            {error}
          </AppText>
          <TouchableOpacity
            className="mt-4 px-5 py-2 bg-blue-500 rounded-lg"
            onPress={handleSearch}
          >
            <AppText color="white" bold>
              Retry
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 80,
            backgroundColor: "#f4f6fb",
          }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => fetchProducts(query)}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
  );
}
