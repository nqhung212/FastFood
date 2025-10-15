import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type CategoryItem = {
    id: string;
    name: string;
};

type CategoryListProps = {
    categories: CategoryItem[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
};

const CategoryList = ({ categories, selectedCategory, onSelectCategory }: CategoryListProps) => {
    
    const renderItem = ({ item }: { item: CategoryItem }) => {
        const isSelected = selectedCategory === item.id;
        return (
            <TouchableOpacity 
                style={[styles.categoryButton, isSelected && styles.activeCategoryButton]}
                onPress={() => onSelectCategory(item.id)}
            >
                <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };
    
    return (
        <View>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    categoryButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    activeCategoryButton: {
        backgroundColor: '#D70F17',
    },
    categoryText: {
        color: '#333',
        fontWeight: '500',
    },
    activeCategoryText: {
        color: '#fff',
    },
});

export default CategoryList;