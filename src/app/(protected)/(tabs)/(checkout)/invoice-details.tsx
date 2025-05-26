import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { AppText } from "@/components/AppText";
import { Invoice, InvoiceItem } from "@/models/Invoice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProductService from "@/services/productService";
import { Product } from "@/models/Product";

export default function InvoiceDetailsScreen() {
  const { invoice } = useLocalSearchParams();
  const invoiceData: Invoice = JSON.parse(invoice as string);

  // State to store loaded products by barcode
  const [products, setProducts] = useState<{
    [barcode: string]: Product | null;
  }>({});
  const [loadingBarcodes, setLoadingBarcodes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch product details for all items if not already loaded
    invoiceData.items.forEach(async (item: InvoiceItem) => {
      if (!item.bar_code || products[item.bar_code]) return;
      setLoadingBarcodes((prev) => [...prev, item.bar_code]);
      try {
        const product = await ProductService.getProductByID(item.bar_code);
        setProducts((prev) => ({ ...prev, [item.bar_code]: product }));
      } catch {
        setProducts((prev) => ({ ...prev, [item.bar_code]: null }));
      } finally {
        setLoadingBarcodes((prev) => prev.filter((b) => b !== item.bar_code));
      }
    });
  }, [invoiceData.items]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white m-4 p-5 rounded-xl shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-3">
              <MaterialCommunityIcons
                name="cash-multiple"
                size={28}
                color="#3498db"
              />
            </View>
            <View>
              <AppText bold size="heading" className="mb-1">
                {invoiceData.total_price.toFixed(2)} €
              </AppText>
              <AppText color="secondary" size="small">
                Total Amount
              </AppText>
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 my-2" />

          {/* Invoice Items */}
          <View className="flex-row justify-between mb-2">
            <AppText color="secondary" size="small">
              Transaction ID
            </AppText>
            <AppText bold>
              CM-{new Date(invoiceData.createdAt).getFullYear()}
              {(new Date(invoiceData.createdAt).getMonth() + 1)
                .toString()
                .padStart(2, "0")}
              {invoiceData.id}
            </AppText>
          </View>

          <View className="flex-row justify-between mb-2">
            <AppText color="secondary" size="small">
              Date
            </AppText>
            <AppText>{formatDate(invoiceData.createdAt)}</AppText>
          </View>

          <View className="flex-row justify-between mb-2">
            <AppText color="secondary" size="small">
              Payment Method
            </AppText>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={18}
                color="#64748b"
                style={{ marginRight: 4 }}
              />
              <AppText>Card •••• {invoiceData.card_number.slice(-4)}</AppText>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="mx-4 h-[1px] bg-gray-200 my-2" />

        {/* Invoice Items */}
        <View className="bg-white m-4 p-5 rounded-xl shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={20}
              color="#3498db"
              style={{ marginRight: 6 }}
            />
            <AppText bold color="primary">
              Items
            </AppText>
          </View>
          {invoiceData.items.map((item: InvoiceItem, index: number) => {
            const product = products[item.bar_code];
            const isLoading = loadingBarcodes.includes(item.bar_code);

            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center py-3 ${
                  index !== invoiceData.items.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                activeOpacity={0.7}
                onPress={() => {
                  if (product) {
                    router.navigate({
                      pathname:
                        "/(protected)/(tabs)/(products)/product-details",
                      params: { product: JSON.stringify(product) },
                    });
                  }
                }}
                disabled={!product}
              >
                {/* Product Image */}
                {isLoading ? (
                  <View className="w-14 h-14 rounded-lg mr-4 bg-gray-100 items-center justify-center">
                    <ActivityIndicator size="small" color="#3498db" />
                  </View>
                ) : product && product.image_url ? (
                  <Image
                    source={{ uri: product.image_url }}
                    className="w-14 h-14 rounded-lg mr-4 bg-gray-100"
                  />
                ) : (
                  <View className="w-14 h-14 rounded-lg mr-4 bg-gray-100 items-center justify-center">
                    <MaterialCommunityIcons
                      name="food"
                      size={32}
                      color="#ccc"
                    />
                  </View>
                )}
                <View className="flex-1">
                  <AppText bold>
                    {product ? product.name : item.product_name}
                  </AppText>
                  <AppText color="secondary" size="small">
                    Quantity : {item.quantity}
                  </AppText>
                  <AppText color="secondary" size="small">
                    Barcode : {item.bar_code}
                  </AppText>
                  <AppText color="primary" bold>
                    {product && product.price
                      ? `${product.price} € / unit`
                      : ""}
                  </AppText>
                </View>
                {/* Eye icon to indicate details */}
                {product && (
                  <MaterialCommunityIcons
                    name="eye"
                    size={22}
                    color="#3498db"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
