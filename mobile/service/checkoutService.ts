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
    // new schema: user_account table with user_id and full_name
    const { error: updateErr } = await supabase
        .from("user_account")
        .update({ full_name: fullname, phone })
        .eq("user_id", userId);
    
    if (updateErr) throw updateErr;

    // Cập nhật lại AsyncStorage
    await AsyncStorage.setItem(
        "user",
        JSON.stringify({ ...user, fullname, phone, address })
    );
};

// --- Order Service (Tạo đơn hàng) ---

const createOrderInSupabase = async (orderId: string, orderData: any) => {
        const { userId, totalPrice, fullname, phone, address, checkoutItems, restaurantId } = orderData;

        // Determine restaurant: prefer explicit restaurantId, otherwise infer from first item
        const rId = restaurantId ?? (checkoutItems?.[0]?.restaurant_id ?? null);

        // 1. Create order in new schema: table is named "order"
        const { error: orderError } = await supabase
            .from('order')
            .insert([
                {
                    order_id: orderId,
                    customer_id: userId,
                    restaurant_id: rId,
                    total_price: totalPrice,
                    payment_status: 'pending',
                    order_status: 'pending',
                    shipping_name: fullname,
                    shipping_address: address,
                    shipping_phone: phone,
                },
            ]);
        if (orderError) throw orderError;

        // 2. Save order items (order_item table)
        const orderItems = checkoutItems.map((item: any) => ({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
        }));

    const { error: itemsError } = await supabase.from('order_item').insert(orderItems);
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

    // Return orderId so caller can continue flow (e.g., poll or finalize)
    return { orderId, payUrl };
};

/**
 * Finalize a MoMo order client-side (used for quick test/simulate flows).
 * This will mark order as paid/confirmed and insert a payment record.
 */
export const finalizeMomoOrder = async (orderId: string, amount: number) => {
    try {
        // Ensure order exists before updating/inserting payment
        const { data: existingOrder, error: orderCheckErr } = await supabase
            .from('order')
            .select('order_id')
            .eq('order_id', orderId)
            .maybeSingle();
        if (orderCheckErr) throw orderCheckErr;

        if (!existingOrder) {
            // Insert a minimal placeholder order so FK constraint won't fail.
            // shipping_name/address/phone are NOT NULL in schema, so provide empty strings.
            const { error: insertErr } = await supabase.from('order').insert([
                {
                    order_id: orderId,
                    customer_id: null,
                    restaurant_id: null,
                    total_price: amount || 0,
                    payment_status: 'paid',
                    order_status: 'confirmed',
                    shipping_name: '',
                    shipping_address: '',
                    shipping_phone: '',
                },
            ]);
            if (insertErr) throw insertErr;
        } else {
            const { error: updateErr } = await supabase
                .from('order')
                .update({ payment_status: 'paid', order_status: 'confirmed' })
                .eq('order_id', orderId);
            if (updateErr) throw updateErr;
        }

        // Insert payment record only if not exists to avoid duplicates (idempotent)
        const { data: existingPayments, error: existingErr } = await supabase
            .from('payment')
            .select('payment_id')
            .eq('order_id', orderId)
            .eq('provider', 'momo')
            .maybeSingle();
        if (existingErr) throw existingErr;
        if (!existingPayments) {
            const { error: payErr } = await supabase.from('payment').insert([
                {
                    order_id: orderId,
                    provider: 'momo',
                    amount: amount || 0,
                    status: 'success',
                    created_at: new Date().toISOString(),
                },
            ]);
            if (payErr) throw payErr;
        }

        return { success: true };
    } catch (err) {
        console.warn('finalizeMomoOrder err', err);
        return { success: false, error: err };
    }
};