import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { AppText } from "@/components/AppText";
import BankCardService from "@/services/bankCardService";
import { useRouter } from "expo-router";

const CARD_TYPES = [
  { label: "Visa", color: "#8e44ad" },
  { label: "Mastercard", color: "#f39c12" },
  { label: "Amex", color: "#e74c3c" },
];

export default function CardModal() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardType, setCardType] = useState(CARD_TYPES[0].label);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!cardNumber || !cardHolder || !expiry || !cardType) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await BankCardService.addBankCard({
        card_number: cardNumber,
        card_holder: cardHolder,
        expiry_date: expiry,
        card_type: cardType,
      });
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (input: string) => {
    const digits = input.replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    let cleaned = text.replace(/[^\d]/g, "");
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    setExpiry(cleaned.slice(0, 5));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AppText className="mb-2">Card Number</AppText>
      <TextInput
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        placeholder="1234 5678 9012 3456"
        keyboardType="number-pad"
        maxLength={19}
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#d1d5db",
        }}
      />
      <AppText className="mb-2">Card Holder</AppText>
      <TextInput
        value={cardHolder}
        onChangeText={setCardHolder}
        placeholder="Name on card"
        autoCapitalize="words"
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#d1d5db",
        }}
      />
      <AppText className="mb-2">Expiry Date</AppText>
      <TextInput
        value={expiry}
        onChangeText={handleExpiryChange}
        placeholder="MM/YY"
        maxLength={5}
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#d1d5db",
        }}
      />
      <AppText className="mb-2">Card Type</AppText>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        {CARD_TYPES.map((type) => (
          <TouchableOpacity
            key={type.label}
            onPress={() => setCardType(type.label)}
            style={{
              backgroundColor: cardType === type.label ? type.color : "#e5e7eb",
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginRight: 8,
            }}
          >
            <AppText color={cardType === type.label ? "white" : "primary"}>
              {type.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={handleAdd}
        disabled={
          loading ||
          !cardNumber.trim() ||
          !cardHolder.trim() ||
          !expiry.trim() ||
          !cardType.trim()
        }
        style={{
          backgroundColor:
            loading ||
            !cardNumber.trim() ||
            !cardHolder.trim() ||
            !expiry.trim() ||
            !cardType.trim()
              ? "#93c5fd"
              : "#3498db",
          borderRadius: 8,
          paddingVertical: 14,
          alignItems: "center",
        }}
      >
        <AppText color="white" bold>
          {loading ? "Loading..." : "Save"}
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}
