import { supabase } from "@/service/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as WebBrowser from "expo-web-browser";

// --- User Service (Lấy/Cập nhật User) ---

export const getStoredUser = async () => {
    try {
        const saved = await AsyncStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    } catch (err) {
        console.error("Error loading user:", err);
        return null;
    }
};

export const updateUserProfile = async (userId: string, user: any, details: { name: string, phone: string, address: string }) => {
    const { name: fullname, phone, address } = details;
    const { error: updateErr } = await supabase
        .from("users")
        .update({ fullname, phone, address })
        .eq("id", userId);
    
    if (updateErr) throw updateErr;

    // Cập nhật lại AsyncStorage
    await AsyncStorage.setItem(
        "user",
        JSON.stringify({ ...user, fullname, phone, address })
    );
};

// --- Order Service (Tạo đơn hàng) ---

const createOrderInSupabase = async (orderId: string, orderData: any) => {
    const { userId, totalPrice, fullname, phone, address, checkoutItems } = orderData;
    
    // 1. Tạo đơn hàng
    const { error: orderError } = await supabase
        .from("orders")
        .insert([
            {
                id: orderId, // Dùng ID đã tạo
                user_id: userId,
                total_amount: totalPrice,
                status: "pending",
                customer_name: fullname,
                customer_phone: phone,
                customer_address: address,
            },
        ]);
    if (orderError) throw orderError;

    // 2. Lưu sản phẩm
    const orderItems = checkoutItems.map((item: any) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
    }));

    const { error: itemsError } = await supabase
        .from("order_item")
        .insert(orderItems);
    if (itemsError) throw itemsError;
};

// --- Payment Service (Thanh toán) ---
// Server Node.js của bạn
const MOMO_SERVER_URL = "https://ingenuous-absolutely-cletus.ngrok-free.dev";

export const createMoMoPayment = async (orderId: string, totalPrice: number, checkoutItems: any[]) => {
    const resp = await fetch(`${MOMO_SERVER_URL}/api/momo/checkout`, {
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
        throw new Error(`Server MoMo responded with status ${resp.status}`);
    }

    const data = await resp.json();
    if (data?.success && data?.payUrl) {
        return data.payUrl;
    } else {
        throw new Error(data?.message || "Không lấy được link thanh toán MoMo!");
    }
};

export const openPaymentBrowser = async (payUrl: string) => {
    try {
        await WebBrowser.openBrowserAsync(payUrl);
    } catch (err) {
        console.warn("WebBrowser failed, fallback to Linking.openURL", err);
        // Fallback (ít dùng hơn)
        // const Linking = (await import("expo-linking")).default;
        // await Linking.openURL(payUrl);
    }
};

// --- Hàm Gộp (Dùng trong Hook) ---

/**
 * Xử lý đơn hàng COD (Đặt hàng)
 */
export const processCodOrder = async (orderData: any) => {
    const { userId, user, form } = orderData;
    if (userId) {
        await updateUserProfile(userId, user, form);
    }
    
    // Tạo ID đơn hàng ngẫu nhiên cho COD
    const orderId = uuidv4(); 
    await createOrderInSupabase(orderId, orderData);
};

/**
 * Xử lý đơn hàng MoMo
 */
export const processMomoOrder = async (orderData: any) => {
    // 1. Tạo đơn hàng 'pending' trong Supabase
    const orderId = uuidv4(); // Tạo ID trước
    await createOrderInSupabase(orderId, orderData);

    // 2. Gọi server MoMo lấy link thanh toán
    const payUrl = await createMoMoPayment(orderId, orderData.totalPrice, orderData.checkoutItems);

    // 3. Mở trang thanh toán
    await openPaymentBrowser(payUrl);
};