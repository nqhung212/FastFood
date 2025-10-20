import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../cart/CartContext";
import { styles } from "../../assets/css/product_id.style";
import { fetchProductById } from "@/service/productService";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const pid = Number(id);
    if (Number.isNaN(pid)) return;

    const loadProduct = async () => {
      try {
        const row = await fetchProductById(pid);
        if (row) {
          setProduct({
            ...row,
            price: typeof row.price === "string" ? Number(row.price) : row.price,
          });
        } else {
          Alert.alert("Lỗi", "Không tìm thấy sản phẩm trong Supabase!");
        }
      } catch (err) {
        console.error("Lỗi Supabase:", err);
        Alert.alert("Lỗi", "Không thể tải dữ liệu sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng!");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#511111ff" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Sản phẩm không tồn tại!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Image source={{ uri: product.image }} style={styles.imageHeader} />

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>
            {product.price.toLocaleString()}đ
          </Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng Cộng:</Text>
          <Text style={styles.totalPrice}>
            {(product.price * quantity).toLocaleString()}đ
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addToCartButton, styles.buyNowButton]}
            onPress={() => router.push("/cart/checkout")}
          >
            <Text style={styles.buttonText}>Thanh Toán Ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
