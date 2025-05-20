import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BankCardService from "@/services/bankCardService";
import Utils from "@/utils/Utils";

export default function CreditCardsScreen() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCards = await BankCardService.getCardsByUserID();

      // Transform API cards to UI format
      const formattedCards = fetchedCards.map((card) => ({
        id: card.id,
        number: Utils.getLast4Digits(card.card_number),
        holder: card.card_holder,
        expiry: card.expiry_date,
        color: getCardColor(card.card_type),
        isDefault: card.is_default,
        cardType: card.card_type,
      }));

      setCards(formattedCards);
    } catch (err: any) {
      setError(err.message || "Failed to load cards");
      Alert.alert("Error", err.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign colors based on card type
  const getCardColor = (cardType: string): string => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "#8e44ad";
      case "mastercard":
        return "#f39c12";
      case "amex":
        return "#e74c3c";
      default:
        return "#3498db";
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(), // Temporary ID until saved to backend
      balance: "$0.00",
      number: "0000",
      holder: "New Card",
      expiry: "MM/YY",
      color: "#3498db",
      cardType: "default",
    };
    setCards([...cards, newCard]);
    // In a real implementation, you would call BankCardService.addBankCard here
  };

  const handleDeleteCard = (id: number) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await BankCardService.deleteBankCard(id);
            setCards(cards.filter((card) => card.id !== id));
            Alert.alert("Success", "Card deleted successfully");
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete card");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderRightActions = (id: number) => (
    <View
      style={{
        width: 80,
        backgroundColor: "#e74c3c",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4, // Match the card's bottom margin
        height: "100%", // Fill the entire height
      }}
    >
      <TouchableOpacity
        onPress={() => handleDeleteCard(id)}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="delete" size={28} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 4 }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCard = ({ item }: { item: any }) => (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
      rightThreshold={40}
    >
      <View
        className="rounded-lg p-4 mb-4 shadow-md"
        style={{ backgroundColor: item.color }}
      >
        {/* Balance display removed as requested */}
        <Text className="text-lg text-white mb-2">
          **** **** **** {item.number}
        </Text>
        <Text className="text-sm text-white mb-1">{item.holder}</Text>
        <Text className="text-sm text-white">Expiry: {item.expiry}</Text>

        {/* Display card type */}
        <View className="absolute bottom-2 right-2 bg-white/20 rounded-md px-2 py-1">
          <Text className="text-xs font-bold text-white uppercase">
            {item.cardType || "Card"}
          </Text>
        </View>

        {item.isDefault && (
          <View className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
            <Text className="text-xs font-bold text-blue-500">Default</Text>
          </View>
        )}
      </View>
    </ReanimatedSwipeable>
  );

  if (loading && cards.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3498db" />
        <Text className="mt-4 text-gray-600">Loading cards...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-blue-50 p-4">
        {error && cards.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 mb-4">{error}</Text>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={fetchCards}
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchCards}
          />
        )}
        <TouchableOpacity
          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
          onPress={handleAddCard}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}
