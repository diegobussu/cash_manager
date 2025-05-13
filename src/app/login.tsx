import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { AuthContext } from "@/utils/authContext";
import { useContext, useState } from "react";
import { TextInput, View } from "react-native";
import { Link } from "expo-router";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include letters, numbers, and special characters",
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Login successful ! Redirecting...");
    setTimeout(() => {
      authContext.logIn();
    }, 2000);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <AppText size="heading" center bold>
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
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-2 bg-white"
      />
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
