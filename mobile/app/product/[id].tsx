import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import data from '../data/data.json';
import { IMAGES } from '../../constants/menuDATA';

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = data.products.find((p) => p.id.toString() === id);

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (!product) {
        return <Text>Sản phẩm không tồn tại!</Text>;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <Image source={IMAGES[product.image]} style={styles.imageHeader} />
                
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price.toLocaleString()}đ</Text>
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
                    <Text style={styles.totalPrice}>{(product.price * quantity).toLocaleString()}đ</Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.addToCartButton}>
                        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addToCartButton, styles.buyNowButton]}>
                        <Text style={styles.buttonText}>Thanh Toán Ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { paddingBottom: 150 },
    imageHeader: { width: '100%', height: 300, resizeMode: 'cover' },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: { padding: 20 },
    productName: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    productPrice: { fontSize: 24, fontWeight: '700', color: '#D70F17', marginBottom: 16 },
    productDescription: { fontSize: 16, color: '#666', lineHeight: 24 },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        width: 50,
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: { fontSize: 24, color: '#333' },
    quantityText: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'red',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: { fontSize: 18, color: '#666' },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#D70F17' },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    addToCartButton: {
        backgroundColor: '#FFC72C',
        paddingVertical: 15,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginRight: 10,
    },
    buyNowButton: {
        backgroundColor: '#D70F17',
        marginRight: 0,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProductDetailScreen;