import React, { useContext, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CartContext, CartItem } from "@/utils/cartContext";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CreditCardService from "@/services/creditCardService";
import { CreditCard } from "@/models/CreditCard";
import Utils from "@/utils/Utils";

export default function IndexScreen() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useContext(CartContext);
  const router = useRouter();
  const [paymentCards, setPaymentCards] = useState<CreditCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load payment cards when needed
  const loadPaymentCards = async () => {
    if (paymentCards.length > 0) return;

    try {
      setIsLoadingCards(true);
      const cards = await CreditCardService.getCardsByUserID();
      setPaymentCards(cards);

      // Auto-select default card if available
      const defaultCard = cards.find((card) => card.is_default);
      if (defaultCard) {
        setSelectedCard(defaultCard);
      } else if (cards.length > 0) {
        setSelectedCard(cards[0]);
      }
    } catch (error) {
      console.error("Failed to load payment cards:", error);
    } finally {
      setIsLoadingCards(false);
    }
  };

  React.useEffect(() => {
    if (items.length > 0) {
      loadPaymentCards();
    }
  }, [items.length]);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItem(productId),
        },
      ],
    );
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    if (!selectedCard) {
      Alert.alert(
        "No Payment Method",
        "Please add a payment method in your profile settings",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Card",
            onPress: () =>
              router.navigate("/(protected)/(tabs)/(settings)/credit-cards"),
          },
        ],
      );
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      `Total: ${totalPrice.toFixed(2)} €\nPay with card ending in ${Utils.getLast4Digits(selectedCard.card_number)}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: processPayment },
      ],
    );
  };

  const processPayment = async () => {
    // Here you would typically call your payment API
    // For now, we'll just simulate a payment process
    setIsProcessingPayment(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - clear cart and show confirmation
      clearCart();
      Alert.alert(
        "Payment Successful",
        "Your order has been processed successfully!",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment.",
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row bg-white rounded-lg shadow-sm p-4 mb-3">
      {/* Product Image */}
      <View className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 mr-3">
        {item.product.image_url ? (
          <Image
            source={{ uri: item.product.image_url }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <MaterialCommunityIcons name="food" size={32} color="#ccc" />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="flex-1 justify-between">
        <View>
          <AppText bold>{item.product.name}</AppText>
          <AppText size="small" color="secondary">
            {item.product.brand}
          </AppText>
          <AppText bold color="primary" className="mt-1">
            {item.product.price
              ? `${(item.product.price * item.quantity).toFixed(2)} €`
              : "N/A"}
          </AppText>
        </View>

        {/* Quantity Controls */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="p-1 bg-gray-200 rounded-full"
              onPress={() =>
                handleQuantityChange(item, Math.max(1, item.quantity - 1))
              }
            >
              <MaterialCommunityIcons name="minus" size={18} color="#333" />
            </TouchableOpacity>
            <AppText className="mx-3">{item.quantity}</AppText>
            <TouchableOpacity
              className="p-1 bg-gray-200 rounded-full"
              onPress={() => handleQuantityChange(item, item.quantity + 1)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="p-1"
            onPress={() => handleRemoveItem(item.product.id)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#FF3B30"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View className="flex-1 justify-center items-center p-4">
      <MaterialCommunityIcons name="cart-outline" size={80} color="#d1d5db" />
      <AppText size="large" bold className="mt-4 mb-2">
        Your cart is empty
      </AppText>
      <AppText color="secondary" center className="mb-6">
        Add products from the catalog or scan items to fill your cart
      </AppText>
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => router.navigate("/(protected)/(tabs)/(products)")}
      >
        <AppText color="white" bold>
          Browse Products
        </AppText>
      </TouchableOpacity>
    </View>
  );

  // Show loading spinner during payment processing
  if (isProcessingPayment) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText className="mt-4">Processing your payment...</AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-2">
        <AppText bold size="heading">
          Shopping Cart
        </AppText>
        <AppText color="secondary" size="small" className="mt-1">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </AppText>
      </View>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary & Checkout Button */}
          <View className="bg-white p-4 border-t border-gray-200">
            <View className="flex-row justify-between mb-2">
              <AppText>Subtotal</AppText>
              <AppText bold>{totalPrice.toFixed(2)} €</AppText>
            </View>

            {/* Payment Method Selector - Simple version */}
            {paymentCards.length > 0 && (
              <View className="flex-row justify-between items-center my-2">
                <AppText>Payment Method</AppText>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={18}
                    color="#64748b"
                    style={{ marginRight: 4 }}
                  />
                  <AppText>
                    {selectedCard
                      ? `Card •••• ${Utils.getLast4Digits(selectedCard.card_number)}`
                      : "Select Card"}
                  </AppText>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-blue-600 py-3 rounded-lg items-center mt-4"
              onPress={handleProceedToPayment}
            >
              <AppText color="white" bold>
                Proceed to Checkout
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        renderEmptyCart()
      )}
    </View>
  );
}
