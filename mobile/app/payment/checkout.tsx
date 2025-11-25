import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/assets/css/checkout.style";
import { Stack } from "expo-router";
import { useCheckout } from "@/hooks/use-checkout";


export default function CheckoutScreen() {
    const {
        checkoutItems,
        totalPrice,
        form,
        setForm,
        loading,
        handlePlaceOrder,
        handleMoMoPayment,
    } = useCheckout();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            {/* <SafeAreaView style={styles.safeArea}> */}
                <ScrollView contentContainerStyle={styles.container}>
                    <Image
                        source={{
                        uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png',
                        }}
                        style={styles.logo}
                    />
                    <Text style={styles.header}>Xác nhận thanh toán</Text>

                    {/* Hiển thị sản phẩm */}
                    <View>
                        {checkoutItems.map((item: any) => (
                            <View key={String(item.id)} style={styles.cartItem}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>
                                    {item.quantity} x {item.price.toLocaleString()}đ
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Hiển thị tổng tiền */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalPrice}>
                            {totalPrice.toLocaleString()}đ
                        </Text>
                    </View>

                    {/* Form thông tin */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Họ và tên"
                            value={form.name}
                            onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
                            editable={!loading} // Thêm
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Số điện thoại"
                            value={form.phone}
                            keyboardType="phone-pad"
                            onChangeText={(text) => setForm((f) => ({ ...f, phone: text }))}
                            editable={!loading} // Thêm
                        />
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Địa chỉ giao hàng"
                            value={form.address}
                            multiline
                            onChangeText={(text) => setForm((f) => ({ ...f, address: text }))}
                            editable={!loading} // Thêm
                        />
                    </View>

                    {/* Nút đặt hàng */}
                    <TouchableOpacity
                        style={[styles.orderButton, loading && { opacity: 0.6 }]}
                        onPress={handlePlaceOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.orderText}>Đặt Hàng</Text>
                        )}
                    </TouchableOpacity>

                    {/* Nút thanh toán MoMo */}
                    <TouchableOpacity
                        style={[
                            styles.orderButton,
                            { backgroundColor: "#a50064", marginTop: 12 },
                            loading && { opacity: 0.6 },
                        ]}
                        onPress={handleMoMoPayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.orderText, { color: "white" }]}>
                                Pay with MoMo
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}