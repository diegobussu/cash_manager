import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { AppText } from "@/components/AppText";
import { Invoice, InvoiceItem } from "@/models/Invoice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function InvoiceDetailsScreen() {
  const { invoice } = useLocalSearchParams();
  const invoiceData: Invoice = JSON.parse(invoice as string);

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
          <View className="h-[1px] bg-gray-100 my-2" />

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
          {invoiceData.items.map((item: InvoiceItem, index: number) => (
            <View
              key={item.id}
              className={`flex-row justify-between py-3 ${
                index !== invoiceData.items.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <View className="flex-1">
                <AppText>{item.product_name}</AppText>
                <AppText color="secondary" size="small">
                  Qty: {item.quantity} × Barcode: {item.bar_code}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
