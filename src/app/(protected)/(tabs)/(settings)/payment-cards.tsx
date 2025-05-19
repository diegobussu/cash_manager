import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import { AppText } from "@/components/AppText";
import BankCardService from "@/services/bankCardService";
import { BankCard } from "@/models/BankCard";

export default function PaymentCardsScreen() {
  const [cards, setCards] = useState<BankCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardType, setCardType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCards = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const userCards = await BankCardService.getCardsByUserID();
      setCards(userCards);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to fetch cards.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cardType) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await BankCardService.addBankCard({
        card_number: cardNumber,
        card_holder: cardHolder,
        expiry_date: expiryDate,
        card_type: cardType,
      });
      Alert.alert("Success", "Card added successfully.");
      setShowAddCardForm(false);
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCardType("");
      fetchCards();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to add card.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            setErrorMessage("");
            try {
              await BankCardService.deleteBankCard(cardId);
              Alert.alert("Success", "Card deleted successfully.");
              fetchCards();
            } catch (error: any) {
              setErrorMessage(error.message || "Failed to delete card.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSetDefaultCard = async (cardId: number) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await BankCardService.setDefaultBankCard(cardId);
      Alert.alert("Success", "Card set as default successfully.");
      fetchCards();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to set default card.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f6fb",
      }}
    >
      {!isLoading && (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 16,
                marginBottom: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <AppText bold>{item.card_holder}</AppText>
              <AppText>{`**** **** **** ${item.card_number}`}</AppText>
              <AppText>{`Expiry: ${item.expiry_date}`}</AppText>
              <AppText>{`Type: ${item.card_type}`}</AppText>
              {item.is_default && (
                <AppText color="success" bold>
                  Default Card
                </AppText>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                {!item.is_default && (
                  <Button
                    title="Set as Default"
                    onPress={() => handleSetDefaultCard(item.id)}
                  />
                )}
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => handleDeleteCard(item.id)}
                />
              </View>
            </View>
          )}
        />
      )}

      {isLoading && <ActivityIndicator size="large" color="#0853A9" />}

      {errorMessage && (
        <AppText
          size="small"
          center
          bold
          color="danger"
          className="text-red-500 mb-4"
        >
          {errorMessage}
        </AppText>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
        onPress={() => setShowAddCardForm(!showAddCardForm)}
      >
        <AppText bold color="white">
          {showAddCardForm ? "Cancel" : "Add New Card"}
        </AppText>
      </TouchableOpacity>

      {showAddCardForm && (
        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <TextInput
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="Card Holder"
            value={cardHolder}
            onChangeText={setCardHolder}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="Card Type (e.g., Visa, Mastercard)"
            value={cardType}
            onChangeText={setCardType}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />
          <Button
            title="Save Card"
            onPress={handleAddCard}
            disabled={
              isLoading ||
              !cardNumber ||
              !cardHolder ||
              !expiryDate ||
              !cardType
            }
          />
        </View>
      )}
    </View>
  );
}
