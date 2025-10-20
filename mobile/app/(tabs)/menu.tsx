import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryList from "@/components/CategoryList";
import ProductCard from "@/components/ProductCard";
import { useMenu } from "@/hooks/use-menu";
import { styles } from "@/assets/css/menu.style";
import { useLocalSearchParams } from "expo-router";




export default function MenuScreen() {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    categories,
    loadingCategories,
    loading,
    error,
  } = useMenu();

    const { category } = useLocalSearchParams();
    const categoryId = category ? Number(category) : "all";

    useEffect(() => {
    if (categoryId !== "all") {
        setSelectedCategory(categoryId);
    }
    }, [categoryId]);

  if (loading || loadingCategories) {
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
        <Text style={styles.headerText}>Chọn món</Text>
      </View>

    <CategoryList
      categories={[{ id: 0, name: "Tất cả" }, ...categories]}
      selectedCategory={selectedCategory === "all" ? 0 : selectedCategory}
      onSelectCategory={(id) => setSelectedCategory(id === 0 ? "all" : Number(id))}
    />

      <Text style={styles.sectionHeader}>Món Ngon Phải Thử</Text>

      {filteredProducts.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ color: '#fff' }}>Không có sản phẩm trong danh mục này.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      )}
    </SafeAreaView>
  );
}
