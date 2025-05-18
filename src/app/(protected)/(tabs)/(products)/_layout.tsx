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
        name="product"
        options={{
          title: "Product details",
        }}
      />
    </Stack>
  );
}
