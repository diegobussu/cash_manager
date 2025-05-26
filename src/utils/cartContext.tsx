import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Product } from "@/models/Product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

export const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalPrice: 0,
  totalItems: 0,
});

const CART_STORAGE_KEY = "cart-items";

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from storage when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          const parsedCart = JSON.parse(cartData);
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();
  }, []);

  // Update totals whenever items change
  useEffect(() => {
    const price = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    setTotalPrice(price);
    setTotalItems(count);

    // Save to AsyncStorage
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(
      (error) => console.error("Error saving cart:", error),
    );
  }, [items]);

  const addItem = (product: Product, quantity: number) => {
    setItems((currentItems) => {
      // Check if product is already in cart
      const existingItemIndex = currentItems.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { product, quantity }];
      }
    });
  };

  const removeItem = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
