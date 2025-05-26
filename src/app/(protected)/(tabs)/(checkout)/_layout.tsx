import HistoryButton from "@/components/HistoryButton";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Checkout",
          headerRight: () => <HistoryButton />,
        }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen
        name="invoice-details"
        options={{ title: "Invoice details" }}
      />
    </Stack>
  );
}
