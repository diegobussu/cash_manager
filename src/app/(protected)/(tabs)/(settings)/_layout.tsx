import ProfileButton from "@/components/ProfileButton";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerRight: () => <ProfileButton />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: "Security",
        }}
      />
      <Stack.Screen
        name="payment-cards"
        options={{
          title: "Payment Cards",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          title: "FAQ",
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          title: "About Us",
        }}
      />
      <Stack.Screen
        name="rate-us"
        options={{
          title: "Rate Us",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy Policy",
        }}
      />
    </Stack>
  );
}
