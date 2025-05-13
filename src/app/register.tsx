import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Utils from "@/utils/Utils";
import { User } from "@/models/User";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "@/services/authServices";

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: undefined,
    address: "",
    zip_code: undefined,
    country: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof User, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: undefined,
      address: "",
      zip_code: undefined,
      country: "",
      password: "",
    });
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  }, [router]);

  const handleRegister = async () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      zip_code,
      country,
      password,
    } = formData;

    if (!first_name || !last_name || !email || !password) {
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

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("Registering...");

      const response = await AuthService.register({
        first_name,
        last_name,
        email,
        phone_number,
        address,
        zip_code,
        country,
        password,
      });

      setSuccessMessage("Registration successful ! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorMessage("Email already exists");
      } else {
        setErrorMessage(error.message || "Registration failed");
      }
      setSuccessMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <AppText size="extraHeading" center bold>
          Sign Up
        </AppText>
        <TextInput
          placeholder="First Name"
          value={formData.first_name}
          onChangeText={(value) => handleInputChange("first_name", value)}
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Last Name"
          value={formData.last_name}
          onChangeText={(value) => handleInputChange("last_name", value)}
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Phone Number"
          value={formData.phone_number?.toString()}
          onChangeText={(value) => handleInputChange("phone_number", value)}
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Address"
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Zip Code"
          value={formData.zip_code?.toString()}
          onChangeText={(value) => handleInputChange("zip_code", value)}
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <TextInput
          placeholder="Country"
          value={formData.country}
          onChangeText={(value) => handleInputChange("country", value)}
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
        />
        <View className="relative mb-4">
          <TextInput
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={!showPassword}
            className="border border-gray-300 rounded-md px-4 py-3 bg-white"
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
        <View className="relative mb-4">
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            className="border border-gray-300 rounded-md px-4 py-3 bg-white"
          />
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
          title="Sign Up"
          onPress={handleRegister}
          disabled={
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.password ||
            !confirmPassword
          }
        />
        <Link href="/login" push asChild>
          <Button title="Already have an account ? Log In" theme="tertiary" />
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
