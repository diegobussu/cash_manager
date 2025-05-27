import CartButton from "@/components/CartButton";
import { Stack } from "expo-router";
import { useLocalization } from "@/utils/i18n";

export default function Layout() {
  const { t } = useLocalization();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("products"),
        }}
      />
      <Stack.Screen
        name="product-details"
        options={{
          title: t("productDetails"),
          headerRight: () => <CartButton />,
        }}
      />
      <Stack.Screen
        name="product-modal"
        options={{ presentation: "modal", title: t("addProduct") }}
      />
    </Stack>
  );
}
