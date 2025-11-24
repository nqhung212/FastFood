import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryList from "@/components/CategoryList";
import ProductCard from "@/components/ProductCard";
import { useMenu } from "@/hooks/use-menu";
import { styles } from "@/assets/css/menu.style";
import { useLocalSearchParams } from "expo-router";
import { useAddToCart } from "@/hooks/use-addtocart";
import { fetchRestaurantById } from "@/service/restaurantService";
import { useCart } from "@/app/cart/CartContext";
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const { category, restaurantId } = useLocalSearchParams();
  const rId = restaurantId ? String(restaurantId) : undefined;
  const router = useRouter();
  const { cart, total, totalItemCount } = useCart();

  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(false);

  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    categories,
    loadingCategories,
    loading,
    error,
  } = useMenu(rId);

  const categoryId = category ? String(category) : "all";
  const { handleAddToCart } = useAddToCart(); // 👈 Dùng hook

  useEffect(() => {
    if (categoryId !== "all") {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!rId) return setRestaurant(null);
      setLoadingRestaurant(true);
      const res = await fetchRestaurantById(rId);
      setRestaurant(res);
      setLoadingRestaurant(false);
    };
    loadRestaurant();
  }, [rId]);

  if (loading || loadingCategories || loadingRestaurant) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {restaurant ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: restaurant.logo }} style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }} />
            <View>
              <Text style={[styles.headerText, { fontSize: 18 }]}>{restaurant.name}</Text>
              <Text style={{ color: '#fff', opacity: 0.9, marginTop: 4, maxWidth: 240 }}>{restaurant.description}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.headerText}>Chọn món</Text>
        )}
      </View>

      <CategoryList
        categories={[{ id: 'all', name: "Tất cả" }, ...categories]}
        selectedCategory={selectedCategory === "all" ? 'all' : selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id === 'all' ? "all" : String(id))}
      />

      <Text style={styles.sectionHeader}>Món Ngon Phải Thử</Text>

      {filteredProducts.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ color: "#fff" }}>Không có sản phẩm trong danh mục này.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
    keyExtractor={(item) => String(item.id)}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      )}

      {/* Bottom cart bar - show only when cart has items and the cart's restaurant matches this menu */}
      {cart && cart.length > 0 && rId && (
        (() => {
          const itemsForThis = cart.filter((it) => String(it.restaurant_id) === String(rId));
          if (itemsForThis.length === 0) return null;
          const totalForThis = itemsForThis.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
          const countForThis = itemsForThis.reduce((s, i) => s + (i.quantity || 0), 0);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/payment/checkout?restaurantId=${rId}`)}
              style={{ position: 'absolute', left: 12, right: 12, bottom: 18, backgroundColor: '#fff', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 6 }}
            >
              <View>
                <Text style={{ fontWeight: '700' }}>{countForThis} món</Text>
                <Text style={{ color: '#666' }}>{totalForThis.toLocaleString()}₫</Text>
              </View>
              <View style={{ backgroundColor: '#D70F17', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Thanh toán</Text>
              </View>
            </TouchableOpacity>
          );
        })()
      )}
    </SafeAreaView>
  );
}
