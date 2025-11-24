import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { supabase } from '@/service/supabaseClient';

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
    addToCart: (item: any, quantityToAdd: number) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    increaseQty: (id: string) => Promise<void>;
    decreaseQty: (id: string) => Promise<void>;
    total: number;
    totalItemCount: number;
    clearCart: () => Promise<void>;
    refreshCartForUser: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

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

    // Load unified cart for user (single key per user/guest)
    useEffect(() => {
        const load = async () => {
            const key = `${userId ? `cart_${userId}` : 'cart_guest'}`;
            try {
                const stored = await AsyncStorage.getItem(key);
                setCart(stored ? JSON.parse(stored) : []);
            } catch (err) {
                console.error('Error loading cart', err);
                setCart([]);
            }
        };
        load();
    }, [userId]);

    // Persist cart when it changes
    useEffect(() => {
        const save = async () => {
            const key = `${userId ? `cart_${userId}` : 'cart_guest'}`;
            try {
                await AsyncStorage.setItem(key, JSON.stringify(cart));
            } catch (err) {
                console.error('Error saving cart', err);
            }
        };
        save();
    }, [cart, userId]);

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

    // Load cart from Supabase for given userId and set local cart state
    const loadCartFromSupabase = async (uid?: string) => {
        const targetUser = uid ?? userId;
        if (!targetUser) return;
        try {
            const { data, error } = await supabase
                .from('cart')
                .select(`product_id,quantity,price, product:product_id(name,image_url,restaurant_id)`)
                .eq('customer_id', targetUser)
                .eq('status', 'active');

            if (error) {
                console.warn('Error loading cart from Supabase', error);
                return;
            }

            const rows = data || [];
            const map = new Map<string, CartItem>();

            rows.forEach((row: any) => {
                const prod = Array.isArray(row.product) ? row.product[0] : row.product;
                const pid = String(row.product_id);
                const qty = Number(row.quantity ?? 1);
                const price = Number(row.price ?? (prod?.price ?? 0));
                const existing = map.get(pid);
                if (existing) {
                    existing.quantity += qty;
                } else {
                    map.set(pid, {
                        id: pid,
                        name: prod?.name ?? 'Sản phẩm',
                        price: price,
                        image: prod?.image_url ?? undefined,
                        quantity: qty,
                        restaurant_id: prod?.restaurant_id ?? null,
                    });
                }
            });

            const loaded = Array.from(map.values());
            setCart(loaded);
        } catch (e) {
            console.error('Unexpected error loading cart from Supabase', e);
        }
    };

    const refreshCartForUser = async () => {
        const user = await getUserFromStorage();
        const id = user?.id ? String(user.id) : null;
        setUserId(id);
        const key = `${id ? `cart_${id}` : 'cart_guest'}`;
        try {
            const stored = await AsyncStorage.getItem(key);
            setCart(stored ? JSON.parse(stored) : []);
            // Also load from Supabase so server-side cart takes precedence
            if (id) await loadCartFromSupabase(id);
        } catch (err) {
            console.error('Error loading cart for user', err);
        }
    };

    // When the authenticated user changes, load their cart from Supabase
    useEffect(() => {
        if (userId) {
            loadCartFromSupabase(userId);
        }
    }, [userId]);

    // Add to cart: allow items from multiple restaurants (no forced clear)
    const addToCart = async (item: any, quantityToAdd: number) => {
        const itemId = item.id || item.product_id;
        const itemRestaurant = item.restaurant_id ?? item.restaurantId ?? null;

        // Update local state first
        setCart((prev) => {
            const found = prev.find((p) => p.id === String(itemId));
            if (found) {
                return prev.map((p) => (p.id === String(itemId) ? { ...p, quantity: p.quantity + quantityToAdd } : p));
            }
            return [...prev, { id: String(itemId), name: item.name, price: Number(item.price), image: item.image || item.image_url, quantity: quantityToAdd, restaurant_id: itemRestaurant }];
        });

        // Persist to Supabase for authenticated users
        if (userId) {
            try {
                const { data: existing, error: selErr } = await supabase
                    .from('cart')
                    .select('cart_id,quantity')
                    .eq('customer_id', userId)
                    .eq('product_id', String(itemId))
                    .eq('status', 'active')
                    .maybeSingle();

                if (selErr) console.warn('Error checking existing cart row', selErr);

                if (existing && existing.cart_id) {
                    const newQty = Number(existing.quantity || 0) + quantityToAdd;
                    const { error: updErr } = await supabase.from('cart').update({ quantity: newQty }).eq('cart_id', existing.cart_id);
                    if (updErr) console.warn('Error updating cart row', updErr);
                } else {
                    const { error: insErr } = await supabase.from('cart').insert([{
                        customer_id: userId,
                        product_id: String(itemId),
                        quantity: quantityToAdd,
                        price: Number(item.price) ?? 0,
                        status: 'active',
                    }]);
                    if (insErr) console.warn('Error inserting cart row', insErr);
                }
            } catch (e) {
                console.error('Error persisting addToCart', e);
            }
        }
    };

    const removeFromCart = async (id: string) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
        if (userId) {
            try {
                const { error } = await supabase.from('cart').delete().match({ customer_id: userId, product_id: String(id) });
                if (error) console.warn('Error removing cart row from Supabase', error);
            } catch (e) {
                console.error('Error removingFromCart', e);
            }
        }
    };

    const increaseQty = async (id: string) => {
        setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
        if (userId) {
            try {
                const { data: row, error: selErr } = await supabase.from('cart').select('cart_id,quantity').eq('customer_id', userId).eq('product_id', String(id)).eq('status', 'active').maybeSingle();
                if (selErr) console.warn('Error fetching cart row for increaseQty', selErr);
                if (row && row.cart_id) {
                    const newQty = Number(row.quantity || 0) + 1;
                    const { error } = await supabase.from('cart').update({ quantity: newQty }).eq('cart_id', row.cart_id);
                    if (error) console.warn('Error updating quantity in Supabase', error);
                } else {
                    const { error } = await supabase.from('cart').insert([{ customer_id: userId, product_id: String(id), quantity: 1, price: 0, status: 'active' }]);
                    if (error) console.warn('Error inserting cart row on increaseQty', error);
                }
            } catch (e) {
                console.error('Error in increaseQty', e);
            }
        }
    };

    const decreaseQty = async (id: string) => {
        setCart((prev) => prev.map((p) => (p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)));
        if (userId) {
            try {
                const { data: row, error: selErr } = await supabase.from('cart').select('cart_id,quantity').eq('customer_id', userId).eq('product_id', String(id)).eq('status', 'active').maybeSingle();
                if (selErr) console.warn('Error fetching cart row for decreaseQty', selErr);
                if (row && row.cart_id) {
                    const newQty = Math.max(0, Number(row.quantity || 0) - 1);
                    if (newQty <= 0) {
                        const { error } = await supabase.from('cart').delete().eq('cart_id', row.cart_id);
                        if (error) console.warn('Error deleting cart row after qty 0', error);
                    } else {
                        const { error } = await supabase.from('cart').update({ quantity: newQty }).eq('cart_id', row.cart_id);
                        if (error) console.warn('Error decreasing cart quantity in Supabase', error);
                    }
                }
            } catch (e) {
                console.error('Error in decreaseQty', e);
            }
        }
    };

    const clearCart = async () => {
        const key = `${userId ? `cart_${userId}` : 'cart_guest'}`;
        try {
            await AsyncStorage.setItem(key, JSON.stringify([]));
        } catch (err) {
            console.error('Error clearing cart in storage', err);
        }
        setCart([]);
        // remove from Supabase as well for logged in users
        if (userId) {
            try {
                const { error } = await supabase.from('cart').delete().eq('customer_id', userId);
                if (error) console.error('Error clearing cart in Supabase', error);
            } catch (err) {
                console.error('Error clearing cart in Supabase', err);
            }
        }
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
