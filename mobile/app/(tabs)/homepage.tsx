import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCategories } from "@/service/categoryService";
import { fetchProducts } from "@/service/productService";
import { fetchRestaurants } from "@/service/restaurantService";
import { Category } from "@/type/category";
import { Product } from "@/type/product";
import { Restaurant } from "@/type/restaurant";
import { styles } from "@/assets/css/homepage.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from "../cart/CartContext";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const cartCtx = useContext(CartContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Lấy user từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    loadUser();
  }, []);

  // ✅ Lấy danh mục + sản phẩm
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData, restaurantsData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchRestaurants(),
        ]);
        setCategories(categoriesData || []);
        setProducts(productsData || []);
        setRestaurants(restaurantsData || []);
      } catch (err: any) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      if (cartCtx?.refreshCartForUser) {
        await cartCtx.refreshCartForUser();
      }
      setUser(null);
      Alert.alert("Đã đăng xuất", "Bạn đã đăng xuất thành công!");
    } catch (err) {
      console.error("Logout error", err);
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  // ✅ Lọc sản phẩm theo từ khóa + danh mục
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || p.category_id === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "#000" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png",
          }}
          style={styles.logo}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <Text style={styles.welcome}>
              Xin chào {user ? user.fullname || user.username || user.phone : "👋"}
            </Text>
            <Text style={styles.subText}>Hôm nay bạn muốn ăn gì?</Text>
          </View>

          {/* ✅ Nút đăng nhập / đăng xuất */}
          {user ? (
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#FF6347",
                padding: 8,
                borderRadius: 8,
                height: 35,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("auth/login")}
              style={{
                backgroundColor: "#FF6347",
                padding: 8,
                borderRadius: 8,
                height: 35,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Tìm món ăn, đồ uống..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Banner */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        <Image
          source={{
            uri: "https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png",
          }}
          style={styles.banner}
        />
        <Image
          source={{
            uri: "https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/pizza%20(1).jpg",
          }}
          style={styles.banner}
        />
      </ScrollView>

      {/* Danh mục */}
      <Text style={styles.sectionTitle}>Danh mục</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              selectedCategory === item.id && {
                borderColor: "#FF6347",
                borderWidth: 2,
              },
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === item.id ? null : item.id)
            }
          >
            <Image
              source={{
                uri: "https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/burger.jpg",
              }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Quán nổi tiếng (row layout) */}
      <Text style={styles.sectionTitle}>Quán nổi tiếng</Text>
      {restaurants.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#888", marginTop: 10, marginBottom: 30 }}>Không có quán nào để hiển thị</Text>
      ) : (
        <View style={{ paddingBottom: 16 }}>
          {restaurants.map((r) => (
            <TouchableOpacity key={r.id} style={styles.restaurantRowCard} onPress={() => router.push(`/cart/menu?restaurantId=${r.id}`)}>
              <Image source={{ uri: r.logo || 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }} style={styles.restaurantLogo} resizeMode="cover" />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{r.name}</Text>
                {r.description ? <Text style={styles.restaurantDesc} numberOfLines={2}>{r.description}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Món nổi bật */}
      <Text style={styles.sectionTitle}>Món nổi bật</Text>

      {filteredProducts.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          Không tìm thấy món ăn phù hợp 😢
        </Text>
      ) : (
        <View style={styles.productContainer}>
          {filteredProducts.map((p) => (
            <View key={p.id} style={styles.productCard}>
              <TouchableOpacity onPress={() => router.push(`/product/${p.id}`)}>
                <Image source={{ uri: p.image }} style={styles.productImage} />
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productPrice}>
                  {p.price.toLocaleString()}₫
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 8,
                  backgroundColor: "#FF6347",
                  paddingVertical: 6,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => {
                  if (!cartCtx) return;
                  cartCtx.addToCart(p, 1);
                  Alert.alert("🛒 Đã thêm", `${p.name} đã được thêm vào giỏ hàng`);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Thêm vào giỏ
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
      {/* Simple cart button fixed at bottom-right that navigates to /cart */}
      <View style={{ position: 'absolute', right: 20, bottom: 24, zIndex: 1000 }}>
        <TouchableOpacity
          onPress={() => router.push('cart/Cart')}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#FF6347',
            width: 65,
            height: 65,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Ionicons name="cart" size={26} color="#fff" />
          {cartCtx && cartCtx.totalItemCount > 0 && (
            <View style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#222', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{cartCtx.totalItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
