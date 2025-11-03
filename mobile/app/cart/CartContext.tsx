import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

    type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    };

    type CartContextType = {
    cart: CartItem[];
    addToCart: (item: any, quantityToAdd: number) => void;
    removeFromCart: (id: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    total: number;
    totalItemCount: number;
    clearCart: () => void;
    refreshCartForUser: () => Promise<void>;
};

    export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    // 🔹 Lấy user hiện tại từ AsyncStorage
    useEffect(() => {
        const fetchUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.id?.toString());
        }
        };
        fetchUser();
    }, []);

    // 🔹 Load giỏ hàng riêng của user
    useEffect(() => {
        if (userId) {
        AsyncStorage.getItem(`cart_${userId}`).then((storedCart) => {
            if (storedCart) {
            setCart(JSON.parse(storedCart));
            }
        });
        }
    }, [userId]);

    // 🔹 Lưu giỏ hàng theo userId
    useEffect(() => {
        if (userId) {
        AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        }
    }, [cart, userId]);

    // Helper to get user object from storage
    const getUserFromStorage = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (err) {
            console.error('Error parsing user from storage', err);
            return null;
        }
    };

    // Public helper: refresh cart for current user (call after login)
    const refreshCartForUser = async () => {
        const user = await getUserFromStorage();
        const id = user?.id ? String(user.id) : null;
        setUserId(id);
        try {
            const key = id ? `cart_${id}` : 'cart_guest';
            const stored = await AsyncStorage.getItem(key);
            setCart(stored ? JSON.parse(stored) : []);
        } catch (err) {
            console.error('Error loading cart for user', err);
        }
    };

    const addToCart = (item: any, quantityToAdd: number) => {
        setCart((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
            return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + quantityToAdd } : p
            );
        }
        return [...prev, { ...item, quantity: quantityToAdd }];
        });
    };

    const removeFromCart = (id: number) =>
        setCart((prev) => prev.filter((p) => p.id !== id));

    const increaseQty = (id: number) =>
        setCart((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
        );

    const decreaseQty = (id: number) =>
        setCart((prev) =>
        prev.map((p) =>
            p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
        )
        );

    const clearCart = async () => {
        const key = userId ? `cart_${userId}` : 'cart_guest';
        try {
            await AsyncStorage.setItem(key, JSON.stringify([]));
        } catch (err) {
            console.error('Error clearing cart in storage', err);
        }
        setCart([]);
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

return (
        <CartContext.Provider
        value={{
            cart,
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
