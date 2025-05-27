import { Stack } from "expo-router";
import { useLocalization } from "@/utils/i18n";

export default function Layout() {
  const { t } = useLocalization();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("home"),
        }}
      />
    </Stack>
  );
}
