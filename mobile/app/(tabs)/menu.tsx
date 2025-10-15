import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import data from "../data/data.json";
import { CATEGORIES } from "../../constants/menuDATA";
import CategoryList from "../../components/CategoryList";
import ProductCard from "../../components/ProductCard";

export default function MenuScreen() {
    const allProducts = data.products;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState(allProducts);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(
                (product) => product.categories === selectedCategory
            );
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, allProducts]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Chọn món</Text>
            </View>
            
            <CategoryList 
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <Text style={styles.sectionHeader}>Món Ngon Phải Thử</Text>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <ProductCard item={item} />}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "rgb(163, 16, 19)",
    },
    headerContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
        color: "#fff",
    },
});