import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { IMAGES } from '../constants/menuDATA';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

// Định nghĩa kiểu dữ liệu cho một sản phẩm để code an toàn hơn
type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
};

type ProductCardProps = {
    item: Product;
};

const ProductCard = ({ item }: ProductCardProps) => {
    return (
        <View style={styles.card}>
            <Image
                source={IMAGES[item.image]}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        flex: 1,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        margin: 6,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
        height: 35,
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#D70F17",
        marginTop: 5,
    },
});

export default ProductCard;