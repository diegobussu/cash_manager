import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    zip_code: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      zip_code,
      country,
      password,
      confirmPassword,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !address ||
      !zip_code ||
      !country ||
      !password ||
      !confirmPassword
    ) {
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

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Registration successful! Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <AppText size="heading" center bold>
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
        value={formData.phone_number}
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
        value={formData.zip_code}
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
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
      />
      <TextInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange("confirmPassword", value)}
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 bg-white"
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
        title="Sign Up"
        onPress={handleRegister}
        disabled={
          !formData.first_name ||
          !formData.last_name ||
          !formData.email ||
          !formData.phone_number ||
          !formData.address ||
          !formData.zip_code ||
          !formData.country ||
          !formData.password ||
          !formData.confirmPassword
        }
      />
      <Link href="/login" asChild>
        <Button title="Already have an account ? Log In" theme="tertiary" />
      </Link>
    </View>
  );
}
