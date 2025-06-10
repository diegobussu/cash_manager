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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useLocalization } from "@/utils/i18n";
import Utils from "@/utils/Utils";

export default function HistoryScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useLocalization();

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
      setError(err.message || t("failedToLoadInvoices"));
      Alert.alert(t("error"), err.message || t("failedToLoadInvoices"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const localeToUse = locale === "fr" ? "fr-FR" : "en-US";
    return date.toLocaleDateString(localeToUse, options);
  };

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const date = new Date(item.createdAt);
    const transactionRef = `CM-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${item.id}`;

    return (
      <TouchableOpacity
        className="rounded-xl p-5 mb-4 shadow-lg bg-white border border-gray-100"
        style={{ elevation: 3 }}
        onPress={() => {
          router.navigate({
            pathname: "/(protected)/(tabs)/(checkout)/invoice-details",
            params: { invoice: JSON.stringify(item) },
          });
        }}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color="#3498db"
              />
            </View>
            <AppText bold size="heading">
              {transactionRef}
            </AppText>
          </View>
          <View className="bg-blue-50 py-1 px-3 rounded-full">
            <AppText color="primary" size="small">
              {formatDate(
                typeof item.createdAt === "string"
                  ? item.createdAt
                  : item.createdAt.toISOString(),
              )}
            </AppText>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 my-2" />

        <View className="flex-row justify-between items-center mt-2">
          <View>
            <AppText size="small" color="secondary" className="mb-1">
              {item.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
              {item.items.reduce((sum, i) => sum + i.quantity, 0) > 1
                ? t("itemsPlural")
                : t("itemSingular")}
            </AppText>
          </View>
          <View>
            <AppText bold size="heading" color="primary">
              {Utils.formatPrice(item.total_price, locale)}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <MaterialCommunityIcons
        name="file-document-outline"
        size={70}
        color="#cbd5e1"
      />
      <AppText color="secondary" className="mt-4 text-center">
        {t("noInvoicesFound")}
      </AppText>
      <TouchableOpacity
        className="mt-4 px-5 py-2 bg-blue-500 rounded-lg"
        onPress={fetchInvoices}
      >
        <AppText color="white" bold>
          {t("refresh")}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  if (loading && invoices.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText color="secondary" className="mt-4">
          {t("loadingInvoices")}
        </AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-4">
        <AppText bold size="heading">
          {t("invoiceHistory")}
        </AppText>
        <AppText color="secondary" size="small" className="mt-1">
          {t("viewTransactions")}
        </AppText>
      </View>

      {error && invoices.length === 0 ? (
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
            onPress={fetchInvoices}
          >
            <AppText color="white" bold>
              {t("retry")}
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvoice}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchInvoices}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
  );
}
