import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchCategories } from '@/service/categoryService';
import { fetchProducts } from '@/service/productService';
import { Category } from '@/type/category';
import { Product } from '@/type/product'; 
import { styles } from '@/assets/css/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Lấy user từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    loadUser();
  }, []);

  // ✅ Lấy danh mục + sản phẩm
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
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
    await AsyncStorage.removeItem('user');
    Alert.alert("Đã đăng xuất", "Bạn đã đăng xuất thành công!");
    setUser(null);
  };

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
        <Text style={{ color: '#000' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }}
          style={styles.logo}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <View>
            <Text style={styles.welcome}>
              Xin chào {user ? user.fullname || user.username || user.phone : '👋'}
            </Text>
            <Text style={styles.subText}>Hôm nay bạn muốn ăn gì?</Text>
          </View>

          {/* ✅ Nút đăng nhập / đăng xuất */}
          {user ? (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ backgroundColor: '#FF6347', padding: 8, borderRadius: 8, height: 35 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('auth/login')}
              style={{ backgroundColor: '#FF6347', padding: 8, borderRadius: 8, height: 35 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng nhập</Text>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }}
          style={styles.banner}
        />
        <Image
          source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/pizza%20(1).jpg' }}
          style={styles.banner}
        />
      </ScrollView>

      {/* Danh mục */}
      <Text style={styles.sectionTitle}>Danh mục</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => router.push(`/menu?category=${item.id}`)}
          >
            <Image
              source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/burger.jpg' }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Món nổi bật */}
      <Text style={styles.sectionTitle}>Món nổi bật</Text>
      <View style={styles.productContainer}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.productCard}
            onPress={() => router.push(`/product/${p.id}`)}
          >
            <Image source={{ uri: p.image }} style={styles.productImage} />
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productPrice}>{p.price.toLocaleString()}₫</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
