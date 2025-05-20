import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import InvoiceService from "@/services/invoiceService";
import { Invoice } from "@/models/Invoice";
import { AppText } from "@/components/AppText";

export default function HistoryScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InvoiceService.getInvoicesByUserID();
      // Sort descending by date
      setInvoices(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
      Alert.alert("Error", err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      className="rounded-lg p-4 mb-4 shadow-md bg-white"
      onPress={() => {
        // Navigate to detail if needed
      }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <AppText bold size="heading">
          Invoice #{item.id}
        </AppText>
        <AppText color="secondary">
          {new Date(item.createdAt).toLocaleDateString()}
        </AppText>
      </View>
      <AppText>Total: {item.total_price.toFixed(2)} €</AppText>
      <AppText size="small" color="secondary">
        {item.items.length} item{item.items.length > 1 ? "s" : ""}
      </AppText>
    </TouchableOpacity>
  );

  if (loading && invoices.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText color="secondary" className="mt-4">
          Loading invoices...
        </AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 p-4">
      {error && invoices.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <AppText color="danger" className="mb-4">
            {error}
          </AppText>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={fetchInvoices}
          >
            <AppText color="white" bold>
              Retry
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvoice}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchInvoices}
        />
      )}
    </View>
  );
}
