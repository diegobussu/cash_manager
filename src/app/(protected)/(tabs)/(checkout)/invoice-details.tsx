import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { AppText } from "@/components/AppText";
import { Invoice, InvoiceItem } from "@/models/Invoice";
import { Ionicons } from "@expo/vector-icons";

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
        {/* Invoice Header Info */}
        <View className="bg-white m-4 p-5 rounded-xl shadow-sm">
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
            <AppText>
              Card ending in {invoiceData.card_number.slice(-4)}
            </AppText>
          </View>
        </View>

        {/* Invoice Items */}
        <View className="bg-white m-4 p-5 rounded-xl shadow-sm">
          <AppText bold className="mb-3">
            Items
          </AppText>

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

        {/* Total */}
        <View className="bg-white m-4 p-5 rounded-xl shadow-sm">
          <View className="flex-row justify-between">
            <AppText bold>Total Amount</AppText>
            <AppText bold color="primary" size="heading">
              {invoiceData.total_price.toFixed(2)} €
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
