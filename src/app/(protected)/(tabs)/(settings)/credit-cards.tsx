import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreditCardService from "@/services/creditCardService";
import Utils from "@/utils/Utils";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";

export default function CreditCardsScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<{ [key: number]: string }>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCards = await CreditCardService.getCardsByUserID();

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
    } finally {
      setLoading(false);
    }
  };

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
    router.navigate("/(protected)/(tabs)/(settings)/card-modal");
  };

  const handleDeleteCard = (id: number) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card ?", [
      { text: "Cancel", style: "destructive" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            setDeleteErrors((prev) => ({ ...prev, [id]: "" }));
            await CreditCardService.deleteBankCard(id);
            setCards(cards.filter((card) => card.id !== id));

            setDeleteErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[id];
              return newErrors;
            });
            setSuccessMessage("Card deleted successfully.");
            setTimeout(() => setSuccessMessage(null), 2500);
          } catch (err: any) {
            setDeleteErrors((prev) => ({
              ...prev,
              [id]: err.message || "Failed to delete card",
            }));
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleSetDefault = (id: number) => {
    Alert.alert(
      "Set as Default",
      "Do you want to set this card as your default card?",
      [
        { text: "Cancel", style: "destructive" },
        {
          text: "Set as Default",
          style: "default",
          onPress: async () => {
            try {
              setLoading(true);
              await CreditCardService.setDefaultBankCard(id);
              fetchCards();
              setSuccessMessage("Default card updated.");
              setTimeout(() => setSuccessMessage(null), 2000);
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to set default card");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // Show action sheet on long press (only for non-default cards)
  const handleCardLongPress = (item: any) => {
    if (item.isDefault) return;
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Set as Default", "Delete"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleSetDefault(item.id);
          } else if (buttonIndex === 2) {
            handleDeleteCard(item.id);
          }
        },
      );
    } else {
      Alert.alert(
        "Card Options",
        undefined,
        [
          { text: "Cancel", style: "destructive" },
          {
            text: "Set as Default",
            onPress: () => handleSetDefault(item.id),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleDeleteCard(item.id),
          },
        ],
        { cancelable: true },
      );
    }
  };

  const renderCard = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => handleCardLongPress(item)}
        delayLongPress={300}
      >
        <View
          className="rounded-lg p-4 mb-4 shadow-md"
          style={{ backgroundColor: item.color }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <AppText bold size="heading" color="white">
              **** **** **** {item.number}
            </AppText>
            {item.isDefault && (
              <View className="bg-white rounded-full px-2 py-1 ml-2">
                <AppText size="medium" bold color="primary">
                  Default
                </AppText>
              </View>
            )}
          </View>
          <AppText size="medium" color="white" className="mt-4 mb-1">
            {item.holder}
          </AppText>
          <AppText size="medium" color="white">
            Expiry: {item.expiry}
          </AppText>
          <View className="absolute bottom-2 right-2 bg-white/20 rounded-md px-2 py-1">
            <AppText size="medium" bold color="white" className="uppercase">
              {item.cardType || "Card"}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>

      {deleteErrors[item.id] && (
        <AppText color="danger" className="mb-4 ml-2">
          {deleteErrors[item.id]}
        </AppText>
      )}
    </View>
  );

  if (loading && cards.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText color="secondary" className="mt-4">
          Loading cards...
        </AppText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 p-4">
        {/* No cards UI */}
        {!loading && cards.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
            <MaterialCommunityIcons
              name="credit-card-off-outline"
              size={72}
              color="#cbd5e1"
            />
            <AppText bold size="large" className="mt-6 mb-2 text-center">
              No cards added yet
            </AppText>
            <AppText color="secondary" center className="mb-6">
              Add a credit or debit card to make payments easily and securely.
            </AppText>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg"
              onPress={handleAddCard}
            >
              <AppText color="white" bold>
                Add Card
              </AppText>
            </TouchableOpacity>
          </View>
        ) : error && cards.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <AppText color="danger" className="mb-4">
              {error}
            </AppText>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              onPress={fetchCards}
            >
              <AppText color="primary" bold>
                Retry
              </AppText>
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
        {successMessage && (
          <AppText size="small" center bold color="success" className="mb-4">
            {successMessage}
          </AppText>
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
