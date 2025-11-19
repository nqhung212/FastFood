import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type CartItem = {
    id: string; // UUID product_id
    name: string;
    price: number;
    image?: string;
    quantity: number;
    restaurant_id?: string;
};

type CartContextType = {
    cart: CartItem[];
    restaurantId: string | null;
    addToCart: (item: any, quantityToAdd: number) => Promise<void>;
    removeFromCart: (id: string) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    total: number;
    totalItemCount: number;
    clearCart: () => Promise<void>;
    refreshCartForUser: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Load user from storage
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user.id ? String(user.id) : null);
            }
        };
        fetchUser();
    }, []);

    // Load cart for user + restaurant
    useEffect(() => {
        const load = async () => {
            const key = `${userId ? `cart_${userId}` : 'cart_guest'}_${restaurantId ?? 'none'}`;
            try {
                const stored = await AsyncStorage.getItem(key);
                setCart(stored ? JSON.parse(stored) : []);
            } catch (err) {
                console.error('Error loading cart', err);
                setCart([]);
            }
        };
        load();
    }, [userId, restaurantId]);

    // Persist cart when it changes
    useEffect(() => {
        const save = async () => {
            const key = `${userId ? `cart_${userId}` : 'cart_guest'}_${restaurantId ?? 'none'}`;
            try {
                await AsyncStorage.setItem(key, JSON.stringify(cart));
            } catch (err) {
                console.error('Error saving cart', err);
            }
        };
        save();
    }, [cart, userId, restaurantId]);

    // Helper to get user from storage
    const getUserFromStorage = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (err) {
            console.error('Error parsing user from storage', err);
            return null;
        }
    };

    const refreshCartForUser = async () => {
        const user = await getUserFromStorage();
        const id = user?.id ? String(user.id) : null;
        setUserId(id);
        // Optionally keep same restaurantId; retain current behavior
        const key = `${id ? `cart_${id}` : 'cart_guest'}_${restaurantId ?? 'none'}`;
        try {
            const stored = await AsyncStorage.getItem(key);
            setCart(stored ? JSON.parse(stored) : []);
        } catch (err) {
            console.error('Error loading cart for user', err);
        }
    };

    // Add to cart: enforce single-restaurant per cart
    const addToCart = async (item: any, quantityToAdd: number) => {
        // item expected to have product_id or id and optional restaurant_id
        const itemId = item.id || item.product_id;
        const itemRestaurant = item.restaurant_id || null;

        // If cart has items from another restaurant, prompt user
        if (cart.length > 0 && restaurantId && itemRestaurant && restaurantId !== itemRestaurant) {
            return new Promise<void>((resolve) => {
                Alert.alert(
                    'Giỏ hàng có sản phẩm từ nhà hàng khác',
                    'Bạn có muốn xóa giỏ hàng hiện tại và thêm món này từ nhà hàng khác không?',
                    [
                        { text: 'Hủy', style: 'cancel', onPress: () => resolve() },
                        {
                            text: 'Xóa & Thêm',
                            onPress: async () => {
                                setCart([]);
                                setRestaurantId(itemRestaurant);
                                setCart([{ id: String(itemId), name: item.name, price: Number(item.price), image: item.image || item.image_url, quantity: quantityToAdd, restaurant_id: itemRestaurant }]);
                                resolve();
                            },
                        },
                    ],
                    { cancelable: true }
                );
            });
        }

        // Normal add
        setRestaurantId((prev) => prev ?? itemRestaurant ?? null);
        setCart((prev) => {
            const found = prev.find((p) => p.id === String(itemId));
            if (found) {
                return prev.map((p) => (p.id === String(itemId) ? { ...p, quantity: p.quantity + quantityToAdd } : p));
            }
            return [...prev, { id: String(itemId), name: item.name, price: Number(item.price), image: item.image || item.image_url, quantity: quantityToAdd, restaurant_id: itemRestaurant }];
        });
    };

    const removeFromCart = (id: string) => setCart((prev) => prev.filter((p) => p.id !== id));

    const increaseQty = (id: string) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));

    const decreaseQty = (id: string) =>
        setCart((prev) => prev.map((p) => (p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)));

    const clearCart = async () => {
        const key = `${userId ? `cart_${userId}` : 'cart_guest'}_${restaurantId ?? 'none'}`;
        try {
            await AsyncStorage.setItem(key, JSON.stringify([]));
        } catch (err) {
            console.error('Error clearing cart in storage', err);
        }
        setCart([]);
        setRestaurantId(null);
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                restaurantId,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                total,
                totalItemCount,
                clearCart,
                refreshCartForUser,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};

export default CartProvider;
