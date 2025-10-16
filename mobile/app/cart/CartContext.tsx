import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
    setCart((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
            return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
            );
        }
        return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) =>
        setCart((prev) => prev.filter((p) => p.id !== id));

    const increaseQty = (id: number) =>
        setCart((prev) =>
        prev.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        )
        );

    const decreaseQty = (id: number) =>
        setCart((prev) =>
        prev.map((p) =>
            p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
        )
        );

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, total }}>
        {children}
        </CartContext.Provider>
    );
    }

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
