import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/assets/css/orderHistory.style";
import { supabase } from "@/service/supabaseClient";
import { useRouter } from "expo-router";

export default function OrderHistoryScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
        const saved = await AsyncStorage.getItem("user");
        if (!saved) {
            setLoading(false);
            return;
        }

        const parsed = JSON.parse(saved);
        setUser(parsed);

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", parsed.id)
            .order("created_at", { ascending: false });

        if (error) console.error("Lỗi tải đơn hàng:", error.message);
        else setOrders(data || []);

        setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
        <SafeAreaView style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ff7b5f" />
            <Text style={{ marginTop: 10, color: "#666" }}>Đang tải đơn hàng...</Text>
        </SafeAreaView>
        );
    }

    if (!user) {
        return (
        <SafeAreaView style={styles.centerContainer}>
            <Text style={styles.text}>Vui lòng đăng nhập để xem lịch sử đơn hàng</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/login")}
            >
            <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>📦 Lịch sử đơn hàng</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
            {orders.length === 0 ? (
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
            ) : (
            orders.map((order) => (
                <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                activeOpacity={0.85}
                >
                <View style={styles.orderHeader}>
                    <Text style={styles.orderCode}>Mã đơn: #{order.id.slice(0, 8)}</Text>
                    <View
                    style={[
                        styles.statusBadge,
                        {
                        backgroundColor:
                            order.status === "completed"
                            ? "#2ecc71"
                            : order.status === "pending"
                            ? "#f39c12"
                            : "#e74c3c",
                        },
                    ]}
                    >
                    <Text style={styles.statusText}>
                        {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "pending"
                        ? "Đang xử lý"
                        : "Xác nhận"}
                    </Text>
                    </View>
                </View>

                <Text style={styles.orderDate}>
                    Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </Text>

                <Text style={styles.orderTotal}>
                    Tổng tiền:{" "}
                    <Text style={{ fontWeight: "600" }}>
                    {order.total_amount?.toLocaleString("vi-VN")}₫
                    </Text>
                </Text>
                </TouchableOpacity>
            ))
            )}
        </ScrollView>
        </SafeAreaView>
    );
}
