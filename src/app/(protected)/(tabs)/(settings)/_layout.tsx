import ProfileButton from "@/components/ProfileButton";
import { Stack } from "expo-router";
import { useLocalization } from "@/utils/i18n";

export default function Layout() {
  const { t } = useLocalization();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("settings"),
          headerRight: () => <ProfileButton />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: t("profile"),
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: t("security"),
        }}
      />
      <Stack.Screen
        name="credit-cards"
        options={{
          title: t("creditCardManager"),
        }}
      />
      <Stack.Screen
        name="card-modal"
        options={{ presentation: "modal", title: t("addCreditCard") }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: t("notifications"),
        }}
      />
      <Stack.Screen
        name="languages"
        options={{
          title: t("languages"),
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          title: t("aboutUs"),
        }}
      />
      <Stack.Screen
        name="rate-us"
        options={{
          title: t("rateUs"),
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: t("privacyPolicy"),
        }}
      />
    </Stack>
  );
}
