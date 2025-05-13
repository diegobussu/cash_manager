import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { AuthContext } from "@/utils/authContext";
import { useContext, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import Utils from "@/utils/Utils";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "@/services/authServices";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!Utils.isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!Utils.isValidPassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include letters, numbers, and special characters",
      );
      return;
    }

    try {
      await AuthService.login(email, password);

      setErrorMessage("");
      setSuccessMessage("Login successful ! Redirecting...");

      setTimeout(() => {
        authContext.logIn();
      }, 1000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login",
      );
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <AppText size="extraHeading" center bold>
        Login
      </AppText>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
      />
      <View className="relative mb-4">
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="border border-gray-300 rounded-md px-4 py-3 mb-2 bg-white"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3"
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#000000"
          />
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <AppText size="small" center className="text-red-500 mb-4">
          {errorMessage}
        </AppText>
      ) : null}
      {successMessage ? (
        <AppText size="small" center className="text-green-500 mb-4">
          {successMessage}
        </AppText>
      ) : null}
      <Button
        title="Log in"
        onPress={handleLogin}
        disabled={!email || !password}
      />
      <Link href="/register" asChild>
        <Button title="Don't have an account ? Sign Up" theme="tertiary" />
      </Link>
    </View>
  );
}
