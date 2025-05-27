import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { AuthContext } from "@/utils/authContext";
import { useContext, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import Utils from "@/utils/Utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AuthService from "@/services/authService";
import { useLocalization } from "@/utils/i18n";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const { t } = useLocalization();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage(t("pleaseAllFields"));
      return;
    }

    if (!Utils.isValidEmail(email)) {
      setErrorMessage(t("enterValidEmail"));
      return;
    }

    if (!Utils.isValidPassword(password)) {
      setErrorMessage(t("passwordRequirements"));
      return;
    }

    try {
      await AuthService.login(email, password);

      setErrorMessage("");
      setSuccessMessage(t("loginSuccessful"));

      setTimeout(() => {
        authContext.logIn();
      }, 1000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || t("loginError"));
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <AppText size="extraHeading" center bold className="mb-4">
        {t("login")}
      </AppText>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
      />
      <View className="relative mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-md bg-white px-4 py-3">
          <TextInput
            placeholder={t("password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage ? (
        <AppText
          size="small"
          center
          bold
          color="danger"
          className="text-red-500 mb-4"
        >
          {errorMessage}
        </AppText>
      ) : null}
      {successMessage ? (
        <AppText size="small" center bold color="success" className="mb-4">
          {successMessage}
        </AppText>
      ) : null}
      <Button
        title={t("logIn")}
        onPress={handleLogin}
        disabled={!email || !password}
      />
      <Link href="/register" asChild>
        <Button title={t("dontHaveAccount")} theme="tertiary" />
      </Link>
    </View>
  );
}
