import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
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
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const router = useRouter();

    // --- 1. Hàm Xử lý Cập nhật Realtime ---
    // Hàm này sẽ được gọi khi có thông báo UPDATE từ Supabase
    const handleRealtimeUpdate = (updatedOrder: any) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                // Tìm đơn hàng khớp order_id và thay thế bằng dữ liệu mới nhất
                order.order_id === updatedOrder.order_id 
                    ? updatedOrder 
                    : order
            )
        );
    };

    // --- 2. useEffect 1: Tải dữ liệu Ban đầu và User ---
    useEffect(() => {
        const fetchAndSetup = async () => {
            // A. Tải thông tin User từ AsyncStorage
            const saved = await AsyncStorage.getItem("user");
            if (!saved) {
                setLoading(false);
                return;
            }
            const parsed = JSON.parse(saved);
            setUser(parsed); // Cập nhật state user
            
            // B. Tải Đơn hàng Ban đầu (Initial Load)
            const { data, error } = await supabase
                .from('order')
                .select('*')
                // Giả định user.id là customer_id
                .eq('customer_id', parsed.id) 
                .order('created_at', { ascending: false });

            if (error) console.error("Lỗi tải đơn hàng:", error.message);
            else setOrders(data || []);

            setLoading(false);
        };

        fetchAndSetup();
    }, []); // Chỉ chạy một lần

    // --- 3. useEffect 2: Thiết lập Lắng nghe Realtime ---
    // Chạy khi user state đã được cập nhật
    useEffect(() => {
        // Chỉ lắng nghe nếu đã có thông tin người dùng và quá trình tải ban đầu đã xong
        if (!user || loading) return;

        const channel = supabase
            .channel(`order_updates_${user.id}`)
            .on(
                'postgres_changes',
                { 
                    event: 'UPDATE', // Chỉ quan tâm đến sự kiện CẬP NHẬT
                    schema: 'public', 
                    table: 'order',
                    // Đảm bảo filter đúng với cột customer_id trong DB của bạn
                    filter: `customer_id=eq.${user.id}` 
                },
                (payload: any) => {
                    if (payload.eventType === 'UPDATE') {
                        handleRealtimeUpdate(payload.new);
                    }
                }
            )
            .subscribe();

        // Cleanup: Hủy lắng nghe khi component bị hủy
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, loading]); // Phụ thuộc vào user và loading

    // --- 4. Logic Hiển thị Điều kiện ---
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

    // --- 5. Giao diện Chính ---
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
                                key={order.order_id}
                                style={styles.orderCard}
                                activeOpacity={0.85}
                                onPress={() => router.push(`/order/order?orderId=${order.order_id}`)}
                            >
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderCode}>Mã đơn: #{order.order_id?.slice(0, 8)}</Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor:
                                                order.order_status === "completed"
                                                ? "#2ecc71"
                                                // Đã sửa lỗi chính tả: "confimed" -> "confirmed"
                                                : order.order_status === "confirmed"
                                                ? "#f39c12"
                                                : order.order_status === "cancelled"
                                                ? "#e4220dff"
                                                : order.order_status === "delivering"
                                                ? "#47cba1ff"
                                                : "#f6250eff",
                                        },
                                    ]}
                                >
                                    <Text style={styles.statusText}>
                                        {order.order_status === "completed"
                                        ? "Hoàn thành"
                                        // Đã sửa lỗi chính tả: "confimed" -> "confirmed"
                                        : order.order_status === "confirmed"
                                        ? "Đã nhận đơn"
                                        : order.order_status === "cancelled"
                                        ? "Đã hủy"
                                        : order.order_status === "delivering"
                                        ? "Đang giao"
                                        : "Đang xử lý"}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.orderDate}>
                                Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                            </Text>

                            <Text style={styles.orderTotal}>
                                Tổng tiền:{" "}
                                <Text style={{ fontWeight: "600" }}>
                                    {order.total_price?.toLocaleString("vi-VN")}₫
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}