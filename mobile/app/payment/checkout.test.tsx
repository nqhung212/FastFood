import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    Image,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../cart/CartContext";
import { styles } from "@/assets/css/checkout.style";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/service/supabaseClient";
import * as Linking from "expo-linking";

export default function CheckoutScreen() {
    const { cart, total, clearCart } = useCart();
    const router = useRouter();
    const params = useLocalSearchParams();

    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params?.id) {
            const product = {
                id: params.id,
                name: params.name,
                price: Number(params.price),
                quantity: Number(params.quantity),
                image: params.image,
            };
            setCheckoutItems([product]);
            setTotalPrice(product.price * product.quantity);
        }
    }, [params?.id]);

    useEffect(() => {
        if (!params?.id && cart && cart.length > 0) {
            const isDifferent =
                checkoutItems.length !== cart.length ||
                JSON.stringify(checkoutItems) !== JSON.stringify(cart);

            if (isDifferent) {
                setCheckoutItems(cart);
                setTotalPrice(total);
            }
        }
    }, [cart?.length, total]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const saved = await AsyncStorage.getItem("user");
                if (saved) {
                    const u = JSON.parse(saved);
                    setUser(u);
                    setName(u.fullname || "");
                    setPhone(u.phone || "");
                    setAddress(u.address || "");
                }
            } catch (err) {
                console.error("Error loading user:", err);
            }
        };
        fetchUser();
    }, []);

    const handlePlaceOrder = async () => {
        if (!name || !phone || !address) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin giao hàng!");
            return;
        }

        if (checkoutItems.length === 0) {
            Alert.alert("Không có sản phẩm", "Không có sản phẩm để thanh toán!");
            return;
        }

        setLoading(true);
        try {
            const userId = user?.id || null;

            if (userId) {
                const { error: updateErr } = await supabase
                    .from("user_account")
                    .update({ full_name: name, phone })
                    .eq("user_id", userId);
                if (updateErr) throw updateErr;

                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify({ ...user, fullname: name, phone, address })
                );
            }

            const { data: orderData, error: orderError } = await supabase
                .from('"order"')
                .insert([
                    {
                        customer_id: userId,
                        total_price: totalPrice,
                        payment_status: "pending",
                        order_status: "pending",
                        shipping_name: name,
                        shipping_phone: phone,
                        shipping_address: address,
                    },
                ])
                .select("order_id")
                .single();

            if (orderError) throw orderError;
            const orderId = orderData.order_id;

            const orderItems = checkoutItems.map((item: any) => ({
                order_id: orderId,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase.from("order_item").insert(orderItems);
            if (itemsError) throw itemsError;

            if (!params?.id) clearCart();

            Alert.alert("Thành công", "Đặt hàng thành công!", [
                { text: "OK", onPress: () => router.push("/(tabs)/menu") },
            ]);
        } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể đặt hàng, vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    const handleMoMoPayment = async () => {
        if (!name || !phone || !address) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin giao hàng!");
            return;
        }

        if (checkoutItems.length === 0) {
            Alert.alert("Không có sản phẩm", "Không có sản phẩm để thanh toán!");
            return;
        }

        setLoading(true);
        try {
            const orderId = uuidv4();
            const userId = user?.id || null;

            await supabase.from('"order"').insert([
                {
                    order_id: orderId,
                    customer_id: userId,
                    total_price: totalPrice,
                    payment_status: "pending",
                    order_status: "pending",
                    shipping_name: name,
                    shipping_phone: phone,
                    shipping_address: address,
                },
            ]);

            const orderItems = checkoutItems.map((item: any) => ({
                order_id: orderId,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));
            await supabase.from("order_item").insert(orderItems);

            const serverUrl = "https://ingenuous-absolutely-cletus.ngrok-free.dev";

            try {
                const healthCheck = await fetch(`${serverUrl}/health`);
                const health = await healthCheck.json();
                console.log("Server health check:", health);
            } catch (err) {
                console.error("Server connection error:", err);
                throw new Error("Không thể kết nối đến server thanh toán. Vui lòng thử lại sau.");
            }

            const resp = await fetch(`${serverUrl}/api/momo/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    amount: totalPrice,
                    orderId: orderId,
                    orderInfo: `Thanh toán đơn hàng #${orderId}`,
                    items: checkoutItems,
                }),
            });

            if (!resp.ok) {
                throw new Error(`Server responded with status ${resp.status}`);
            }

            const data = await resp.json();
            console.log("MoMo response:", data);

            if (data?.success && data?.payUrl) {
                try {
                    const WebBrowser = await import("expo-web-browser");
                    await WebBrowser.openBrowserAsync(data.payUrl);
                } catch (err) {
                    console.warn("WebBrowser failed, fallback to Linking.openURL", err);
                    const can = await Linking.canOpenURL(data.payUrl);
                    if (can) await Linking.openURL(data.payUrl);
                    else throw new Error("Không thể mở trang thanh toán MoMo!");
                }

                Alert.alert(
                    "Đang chuyển hướng",
                    "Bạn đang được chuyển đến trang thanh toán MoMo Sandbox. Sau khi thanh toán thành công, bạn sẽ quay lại ứng dụng.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                if (!params?.id) clearCart();
                                router.push("/(tabs)/menu");
                            },
                        },
                    ]
                );
            } else {
                throw new Error(data?.message || "Không lấy được link thanh toán MoMo!");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể tạo link thanh toán. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Image
                        source={{
                            uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png',
                        }}
                        style={styles.logo}
                    />
                    <Text style={styles.header}>Xác nhận thanh toán (TEST)</Text>

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

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}đ</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
                        <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                        <TextInput style={[styles.input, { height: 80 }]} placeholder="Địa chỉ" value={address} onChangeText={setAddress} multiline />
                    </View>

                    <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder} disabled={loading}>
                        <Text style={styles.orderText}>{loading ? 'Đang xử lý...' : 'Đặt hàng (TEST)'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.orderButton, { backgroundColor: '#a50064', marginTop: 12 }]} onPress={handleMoMoPayment} disabled={loading}>
                        <Text style={[styles.orderText, { color: 'white' }]}>{loading ? 'Đang chuyển...' : 'Thanh toán bằng MoMo (TEST)'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

