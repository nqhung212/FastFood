import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/service/supabaseClient";

type CartItem = {
  product_id: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  restaurant_id: string;
};

type CartContextType = {
  restaurants: string[]; // danh sách restaurant_id mà user đã có giỏ hàng
  cartByRestaurant: Record<string, CartItem[]>; // nhóm giỏ hàng theo restaurant
  loadCart: (customerId: string) => Promise<void>;
  loadCartForRestaurant: (customerId: string, restaurantId: string) => Promise<void>;
  addToCart: (customerId: string, productId: string, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [cartByRestaurant, setCartByRestaurant] = useState<Record<string, CartItem[]>>({});

  /** 🔵 1. Load toàn bộ giỏ hàng theo user */
  const loadCart = async (customerId: string) => {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        product_id,
        quantity,
        price,
        product:product_id (name, image_url, restaurant_id)
      `)
      .eq("customer_id", customerId)
      .eq("status", "active");

    if (error) {
      console.error("Error loading cart:", error);
      return;
    }

    const grouped: Record<string, CartItem[]> = {};

    (data || []).forEach((row: any) => {
      // Supabase sometimes returns nested relation as array or object depending on query;
      const prod = Array.isArray(row.product) ? row.product[0] : row.product;
      const rId = prod?.restaurant_id ?? 'unknown';
      if (!grouped[rId]) grouped[rId] = [];

      grouped[rId].push({
        product_id: row.product_id,
        name: prod?.name ?? 'Sản phẩm',
        image: prod?.image_url ?? null,
        price: row.price,
        quantity: row.quantity,
        restaurant_id: rId,
      });
    });

    setCartByRestaurant(grouped);
    setRestaurants(Object.keys(grouped));
  };

  /** 🔵 2. Chỉ load giỏ của 1 restaurant (khi user bấm chọn nhà hàng) */
  const loadCartForRestaurant = async (customerId: string, restaurantId: string) => {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        product_id,
        quantity,
        price,
        product:product_id (name, image_url, restaurant_id)
      `)
      .eq("customer_id", customerId)
      .eq("status", "active");

    if (error) return;

    const filtered = (data || [])
      .map((row: any) => {
        const prod = Array.isArray(row.product) ? row.product[0] : row.product;
        return {
          product_id: row.product_id,
          name: prod?.name ?? 'Sản phẩm',
          image: prod?.image_url ?? null,
          price: row.price,
          quantity: row.quantity,
          restaurant_id: prod?.restaurant_id ?? null,
        };
      })
      .filter((r) => r.restaurant_id === restaurantId);

    setCartByRestaurant((prev) => ({
      ...prev,
      [restaurantId]: filtered,
    }));
  };

  /** 🔵 3. Thêm sản phẩm vào giỏ */
  const addToCart = async (customerId: string, productId: string, quantity = 1) => {
    // kiểm tra sản phẩm đã có chưa
    const { data: existing } = await supabase
      .from("cart")
      .select("*")
      .eq("customer_id", customerId)
      .eq("product_id", productId)
      .eq("status", "active")
      .maybeSingle();

    // lấy thông tin sản phẩm (để lấy restaurant_id)
    const { data: product } = await supabase
      .from("product")
      .select("name, price, image_url, restaurant_id")
      .eq("product_id", productId)
      .maybeSingle();

    if (!product) return;

    const restaurantId = product.restaurant_id;

    // Nếu sản phẩm đã tồn tại → tăng số lượng
    if (existing) {
      const newQty = existing.quantity + quantity;

      await supabase
        .from("cart")
        .update({ quantity: newQty })
        .eq("cart_id", existing.cart_id);

      // Cập nhật lại UI
      await loadCartForRestaurant(customerId, restaurantId);
      return;
    }

    // Nếu chưa có → thêm mới
    await supabase.from("cart").insert({
      customer_id: customerId,
      product_id: productId,
      quantity,
      price: product.price,
      status: "active",
    });

    // cập nhật UI
    await loadCart(customerId);
  };

  return (
    <CartContext.Provider
      value={{
        restaurants,
        cartByRestaurant,
        loadCart,
        loadCartForRestaurant,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
