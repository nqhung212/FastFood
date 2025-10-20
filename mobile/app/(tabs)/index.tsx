import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { fetchCategories } from '@/service/categoryService';
import { fetchProducts } from '@/service/productService';
import { Category } from '@/type/category';
import { Product } from '@/type/product'; 
import { styles } from '@/assets/css/index';


export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

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
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }}
          style={styles.logo}
        />
        <Text style={styles.welcome}>Xin chào 👋</Text>
        <Text style={styles.subText}>Hôm nay bạn muốn ăn gì?</Text>
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
          <TouchableOpacity style={styles.categoryCard} onPress={() => router.push(`/menu?category=${item.id}`)}>
            <Image source={{ uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/burger.jpg' }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Món nổi bật */}
      <Text style={styles.sectionTitle}>Món nổi bật</Text>
      <View style={styles.productContainer}>
        {products.map((p) => (
          <TouchableOpacity key={p.id} style={styles.productCard} onPress={() => router.push(`/product/${p.id}`)}>
            <Image source={{ uri: p.image }} style={styles.productImage} />
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productPrice}>{p.price.toLocaleString()}₫</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
