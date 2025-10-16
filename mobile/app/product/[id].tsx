import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../cart/CartContext';
import { styles } from '../../assets/css/product_id.style';

import data from '../data/data.json';
import { IMAGES } from '../../constants/menuDATA';

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = data.products.find((p) => p.id.toString() === id);
    const { addToCart } = useCart();

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

    const handleAddToCart = () => {
        if (product){
            addToCart(product, quantity);
            alert('Đã thêm thành công!');
        }
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
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart }>
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

export default ProductDetailScreen;