import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Modal, FlatList, Image, Dimensions } from 'react-native';
import { useCart } from './CartContext';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/css/floatingcartbutton.style';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function DraggableCartButton() {
    const { cart, total, increaseQty, decreaseQty, removeFromCart, totalItemCount } = useCart();
    const [modalVisible, setModalVisible] = useState(false);
    const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height - 150 })).current;

    const router = useRouter();

    const handleAddMoreItems = () => {
        setModalVisible(false);
        router.push('/menu');
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value,
                });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    const renderCartItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemContent}>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                </View>

                <View style={styles.itemActions}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyButton}>
                            <Text style={styles.qtyButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyButton}>
                            <Text style={styles.qtyButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.editDeleteButtons}>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={styles.itemTotalPrice}>{ (item.price * item.quantity).toLocaleString() }đ</Text>
        </View>
    );

    return (
        <>
            <Animated.View
                {...panResponder.panHandlers}
                style={[pan.getLayout(), styles.button]}
            >
                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                    <Ionicons name="cart" size={28} color="#fff" />
                    {cart.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalItemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close-circle" size={40} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Phần ăn đã chọn</Text>
                        </View>

                        <FlatList
                            data={cart}
                            renderItem={renderCartItem}
                            keyExtractor={(item) => String(item.id)}
                            ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>}
                        />
                        
                        <View style={styles.footer}>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Tổng Cộng:</Text>
                                <Text style={styles.totalPrice}>{total.toLocaleString()}đ</Text>
                            </View>
                            <View style={styles.footerButtons}>
                                <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMoreItems}>
                                    <Text style={styles.buttonText}>Thêm Món</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.checkoutBtn} onPress={() => {
                                    setModalVisible(false);
                                    router.push('/payment/checkout');
                                }}>
                                    <Text style={[styles.buttonText, { color: 'white' }]}>Thanh Toán</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}