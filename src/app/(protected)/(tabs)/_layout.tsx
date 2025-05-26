import { Tabs } from "expo-router";
import React, { useContext } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CartContext } from "@/utils/cartContext";
import { View } from "react-native";
import { AppText } from "@/components/AppText";

export default function BottomTabsLayout() {
  const { totalItems } = useContext(CartContext);

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#6EB2FF",
        tabBarActiveTintColor: "#0853A9",
      }}
      backBehavior="order"
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(products)"
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="tag-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="barcode-scan"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(checkout)"
        options={{
          title: "Checkout",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <React.Fragment>
              <MaterialCommunityIcons
                name="cart-outline"
                size={size}
                color={color}
              />

              {totalItems > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "#EF4444",
                    borderRadius: 8,
                    width: 12,
                    height: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  pointerEvents="none"
                >
                  <AppText
                    color="white"
                    className="text-[9px] font-bold leading-[12px] text-center items-center justify-center h-[12px] w-[12px] p-0 m-0"
                  >
                    {totalItems > 9 ? "!" : totalItems}
                  </AppText>
                </View>
              )}
            </React.Fragment>
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
