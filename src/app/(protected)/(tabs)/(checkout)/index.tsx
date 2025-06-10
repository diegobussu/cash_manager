import React, { useContext, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { CartContext, CartItem } from "@/utils/cartContext";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CreditCardService from "@/services/creditCardService";
import { CreditCard } from "@/models/CreditCard";
import Utils from "@/utils/Utils";
import InvoiceService from "@/services/invoiceService";
import ProductService from "@/services/productService";
import { useLocalization } from "@/utils/i18n";
import PayPalService from "@/services/payPalService";

export default function IndexScreen() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useContext(CartContext);
  const router = useRouter();
  const [paymentCards, setPaymentCards] = useState<CreditCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { t } = useLocalization();
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>("");

  // New state for payment method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

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
    // Check if the product has a quantity limit and if the new quantity exceeds it
    if (
      typeof item.product.quantity === "number" &&
      newQuantity > item.product.quantity
    ) {
      Alert.alert(
        t("quantityLimitReached"),
        t("cannotAddMoreThan", { quantity: item.product.quantity }),
        [{ text: t("ok") }],
      );
      return;
    }
    updateQuantity(item.product.id, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    Alert.alert(t("removeItem"), t("removeItemConfirmation"), [
      { text: t("cancel"), style: "destructive" },
      {
        text: t("remove"),
        style: "destructive",
        onPress: () => removeItem(productId),
      },
    ]);
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      Alert.alert(t("error"), t("cartEmpty"));
      return;
    }

    if (paymentMethod === "card") {
      if (!selectedCard) {
        Alert.alert(t("noPaymentMethod"), t("addPaymentMethodPrompt"), [
          { text: t("cancel"), style: "destructive" },
          {
            text: t("addCard"),
            onPress: () =>
              router.navigate("/(protected)/(tabs)/(settings)/credit-cards"),
          },
        ]);
        return;
      }

      Alert.alert(
        t("confirmPurchase"),
        t("paymentConfirmation", {
          total: totalPrice.toFixed(2),
          cardDigits: Utils.getLast4Digits(selectedCard.card_number),
        }),
        [
          { text: t("cancel"), style: "destructive" },
          { text: t("payNow"), onPress: processCardPayment },
        ],
      );
    } else {
      // PayPal flow
      Alert.alert(
        t("confirmPurchase"),
        t("paypalConfirmation", {
          total: totalPrice.toFixed(2),
        }),
        [
          { text: t("cancel"), style: "destructive" },
          { text: t("payWithPayPal"), onPress: processPayPalPayment },
        ],
      );
    }
  };

  // Renamed existing function for clarity
  const processCardPayment = async () => {
    setIsProcessingPayment(true);

    try {
      if (!selectedCard) throw new Error(t("noCardSelected"));

      const invoiceItems = items.map((item) => ({
        bar_code: item.product.bar_code,
        product_name: item.product.name,
        quantity: item.quantity,
      }));

      await InvoiceService.addInvoice(selectedCard.card_number, invoiceItems);

      await Promise.all(
        items.map((item) =>
          ProductService.updateProductQuantity(
            item.product.bar_code,
            Math.max(0, (item.product.quantity ?? 0) - item.quantity),
          ),
        ),
      );

      clearCart();
      router.navigate("/(protected)/(tabs)/(checkout)/history");
    } catch (error: any) {
      Alert.alert(
        t("paymentFailed"),
        error?.message || t("paymentProcessError"),
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // New function for PayPal payment flow
  const processPayPalPayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Step 1: Create a PayPal order
      const orderResponse = await PayPalService.createOrder(
        totalPrice,
        `Cash Manager Purchase - ${items.length} items`,
      );

      if (!orderResponse.success || !orderResponse.orderId) {
        throw new Error(t("failedToCreatePayPalOrder"));
      }

      // Step 2: Capture the payment
      const captureResponse = await PayPalService.capturePayment(
        orderResponse.orderId,
      );

      if (!captureResponse.success) {
        throw new Error(t("paypalPaymentCaptureFailed"));
      }

      // Step 3: Process the order in our system
      const invoiceItems = items.map((item) => ({
        bar_code: item.product.bar_code,
        product_name: item.product.name,
        quantity: item.quantity,
      }));

      // Using "PAYPAL" as the card_number to identify PayPal payments
      await InvoiceService.addInvoice(
        "PAYPAL-" + orderResponse.orderId,
        invoiceItems,
      );

      // Update product quantities
      await Promise.all(
        items.map((item) =>
          ProductService.updateProductQuantity(
            item.product.bar_code,
            Math.max(0, (item.product.quantity ?? 0) - item.quantity),
          ),
        ),
      );

      clearCart();
      router.navigate("/(protected)/(tabs)/(checkout)/history");
    } catch (error: any) {
      Alert.alert(
        t("paymentFailed"),
        error?.message || t("paypalProcessError"),
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
          {/* Show max stock */}
          <AppText size="small" color="secondary" className="italic mt-2">
            {t("availableStockColon")} {item.product.quantity}
          </AppText>
          <AppText bold color="primary" className="mt-1">
            {item.product.price
              ? `${(item.product.price * item.quantity).toFixed(2)} €`
              : t("na")}
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
            {editingItemId === item.product.id ? (
              <TextInput
                style={{
                  width: 48,
                  height: 32,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginHorizontal: 8,
                  backgroundColor: "#f1f5f9",
                  borderRadius: 8,
                }}
                keyboardType="number-pad"
                value={editingQuantity}
                autoFocus
                onBlur={() => {
                  let num = parseInt(
                    editingQuantity.replace(/[^0-9]/g, ""),
                    10,
                  );
                  if (isNaN(num)) num = 1;
                  if (num < 1) num = 1;
                  if (
                    typeof item.product.quantity === "number" &&
                    num > item.product.quantity
                  )
                    num = item.product.quantity;
                  setEditingItemId(null);
                  setEditingQuantity("");
                  if (num !== item.quantity) handleQuantityChange(item, num);
                }}
                onChangeText={(text) => {
                  let num = parseInt(text.replace(/[^0-9]/g, ""), 10);
                  if (isNaN(num)) num = 1;
                  else if (
                    typeof item.product.quantity === "number" &&
                    num > item.product.quantity
                  )
                    num = item.product.quantity;
                  setEditingQuantity(num.toString());
                }}
                maxLength={
                  item.product.quantity
                    ? item.product.quantity.toString().length
                    : 3
                }
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setEditingItemId(item.product.id);
                  setEditingQuantity(item.quantity.toString());
                }}
              >
                <AppText className="mx-3">{item.quantity}</AppText>
              </TouchableOpacity>
            )}
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
        {t("cartEmpty")}
      </AppText>
      <AppText color="secondary" center className="mb-6">
        {t("addProductsPrompt")}
      </AppText>
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => router.navigate("/(protected)/(tabs)/(products)")}
      >
        <AppText color="white" bold>
          {t("browseProducts")}
        </AppText>
      </TouchableOpacity>
    </View>
  );

  // Show loading spinner during payment processing
  if (isProcessingPayment) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText className="mt-4">{t("processingPayment")}</AppText>
      </View>
    );
  }

  // Show loading spinner while fetching payment cards
  if (isLoadingCards) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3498db" />
        <AppText className="mt-4">{t("loadingPaymentMethods")}</AppText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 pb-2">
        <AppText bold size="heading">
          {t("shoppingCart")}
        </AppText>
        <AppText color="secondary" size="small" className="mt-1">
          {items.length}{" "}
          {items.length !== 1 ? t("itemsPlural") : t("itemSingular")}{" "}
          {t("inYourCart")}
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
              <AppText>{t("subtotal")}</AppText>
              <AppText bold>{totalPrice.toFixed(2)} €</AppText>
            </View>

            {/* Payment Method Selection */}
            <View className="my-3">
              <AppText bold className="mb-2">
                {t("selectPaymentMethod")}
              </AppText>

              <View className="flex-row mb-2">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center p-3 rounded-lg mr-2 ${paymentMethod === "card" ? "bg-blue-100 border border-blue-500" : "bg-gray-100"}`}
                  onPress={() => setPaymentMethod("card")}
                >
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={20}
                    color={paymentMethod === "card" ? "#0853A9" : "#64748b"}
                  />
                  <AppText
                    className="ml-2"
                    color={paymentMethod === "card" ? "primary" : "secondary"}
                  >
                    {t("creditCard")}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 flex-row items-center p-3 rounded-lg ${paymentMethod === "paypal" ? "bg-blue-100 border border-blue-500" : "bg-gray-100"}`}
                  onPress={() => setPaymentMethod("paypal")}
                >
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={20}
                    color={paymentMethod === "paypal" ? "#0853A9" : "#64748b"}
                  />
                  <AppText
                    className="ml-2"
                    color={paymentMethod === "paypal" ? "primary" : "secondary"}
                  >
                    PayPal
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card Selection (only show if card payment method is selected) */}
            {paymentMethod === "card" && paymentCards.length > 0 && (
              <View className="flex-row justify-between items-center my-2">
                <AppText>{t("paymentMethod")}</AppText>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={18}
                    color="#64748b"
                    style={{ marginRight: 4 }}
                  />
                  <AppText>
                    {selectedCard
                      ? t("cardEnding", {
                          digits: Utils.getLast4Digits(
                            selectedCard.card_number,
                          ),
                        })
                      : t("selectCard")}
                  </AppText>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-blue-600 py-3 rounded-lg items-center mt-4"
              onPress={handleProceedToPayment}
            >
              <AppText color="white" bold>
                {paymentMethod === "card"
                  ? t("proceedToCheckout")
                  : t("payWithPayPal")}
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
