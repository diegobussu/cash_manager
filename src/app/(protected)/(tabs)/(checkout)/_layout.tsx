import HistoryButton from "@/components/HistoryButton";
import { Stack } from "expo-router";
import { useLocalization } from "@/utils/i18n";

export default function Layout() {
  const { t } = useLocalization();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("checkout"),
          headerRight: () => <HistoryButton />,
        }}
      />
      <Stack.Screen name="history" options={{ title: t("history") }} />
      <Stack.Screen
        name="invoice-details"
        options={{ title: t("invoiceDetails") }}
      />
    </Stack>
  );
}
