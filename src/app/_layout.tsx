import { Stack } from "expo-router";
import "../../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/utils/authContext";
import { CartProvider } from "@/utils/cartContext";
import { LocalizationProvider } from "@/utils/i18n";

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                headerShown: false,
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </CartProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}
