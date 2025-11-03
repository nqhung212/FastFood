import { useState, useEffect, useMemo } from "react";
import { useCart } from "../app/cart/CartContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import {
    getStoredUser,
    processCodOrder,
    processMomoOrder,
} from "../service/checkoutService"; // Đường dẫn có thể cần sửa

export const useCheckout = () => {
    const { cart, total, clearCart } = useCart();
    const router = useRouter();
    const params = useLocalSearchParams();

    // --- State ---
    const [user, setUser] = useState<any>(null);
    const [form, setForm] = useState({ name: "", phone: "", address: "" });
    const [loading, setLoading] = useState(false);

    // --- Derived State (Tính toán lại khi dependencies thay đổi) ---
    const { checkoutItems, totalPrice } = useMemo(() => {
        // 1. Trường hợp "Mua ngay"
        if (params?.id) {
            const product = {
                id: params.id,
                name: params.name,
                price: Number(params.price),
                quantity: Number(params.quantity),
                image: params.image,
            };
            return {
                checkoutItems: [product],
                totalPrice: product.price * product.quantity,
            };
        }
        // 2. Trường hợp "Từ giỏ hàng"
        if (cart && cart.length > 0) {
            return { checkoutItems: cart, totalPrice: total };
        }
        // Mặc định
        return { checkoutItems: [], totalPrice: 0 };
    }, [params, cart, total]);

    // --- Effects ---
    // Load thông tin user
    useEffect(() => {
        const fetchUser = async () => {
            const u = await getStoredUser();
            if (u) {
                setUser(u);
                setForm({
                    name: u.fullname || "",
                    phone: u.phone || "",
                    address: u.address || "",
                });
            }
        };
        fetchUser();
    }, []);

    // --- Handlers ---
    
    // Kiểm tra form
    const validateForm = () => {
        if (!form.name || !form.phone || !form.address) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin giao hàng!");
            return false;
        }
        if (checkoutItems.length === 0) {
            Alert.alert("Không có sản phẩm", "Không có sản phẩm để thanh toán!");
            return false;
        }
        return true;
    };

    // Tạo đối tượng dữ liệu đơn hàng
    const createOrderData = () => ({
        fullname: form.name,
        phone: form.phone,
        address: form.address,
        userId: user?.id || null,
        user: user,
        form: form, // Thêm form để sử dụng trong updateUserProfile
        checkoutItems,
        totalPrice,
    });

    // Đặt hàng (COD)
    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = createOrderData();
            console.log("Order data:", orderData); // Debug log
            
            await processCodOrder(orderData);
            
            if (!params?.id) clearCart(); // Xóa giỏ hàng (nếu không phải "mua ngay")

            Alert.alert("Thành công", "Đặt hàng thành công!", [
                { text: "OK", onPress: () => router.push("/(tabs)/menu") },
            ]);
        } catch (err) {
            console.error("COD Error:", err);
            Alert.alert("Lỗi", "Không thể đặt hàng, vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    // Thanh toán MoMo
    const handleMoMoPayment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await processMomoOrder(createOrderData());

            // Thông báo và chuyển hướng
            Alert.alert(
                "Đang chuyển hướng",
                "Sau khi thanh toán thành công, bạn sẽ quay lại ứng dụng.",
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
        } catch (err) {
            console.error("MoMo Error:", err);
            Alert.alert("Lỗi", "Không thể kết nối đến server MoMo!");
        } finally {
            setLoading(false);
        }
    };

    // --- Return ---
    return {
        checkoutItems,
        totalPrice,
        form,
        setForm,
        loading,
        handlePlaceOrder,
        handleMoMoPayment,
    };
};