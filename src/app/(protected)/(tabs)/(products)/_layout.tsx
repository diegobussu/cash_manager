import CartButton from "@/components/CartButton";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Products",
        }}
      />
      <Stack.Screen
        name="product-details"
        options={{
          title: "Product details",
          headerRight: () => <CartButton />,
        }}
      />
      <Stack.Screen
        name="product-modal"
        options={{ presentation: "modal", title: "Add a product" }}
      />
    </Stack>
  );
}
