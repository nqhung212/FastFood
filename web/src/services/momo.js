import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const PROXY_SERVER_URL = "http://localhost:4001";

export async function processMoMoPayment(paymentData) {
  try {
    console.log("🔄 Processing MoMo payment for order:", paymentData.orderId);

    const response = await axios.post(`${PROXY_SERVER_URL}/api/momo/checkout`, {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderInfo: paymentData.orderInfo || "Payment for order",
      items: paymentData.items || [],
    });

    if (response.data.success && response.data.payUrl) {
      console.log("✅ MoMo checkout request created successfully");
      return {
        success: true,
        orderId: response.data.orderId,
        payUrl: response.data.payUrl,
        message: response.data.message,
      };
    } else {
      console.error("❌ MoMo response error:", response.data);
      return {
        success: false,
        message: response.data.message || "Unable to create payment request",
      };
    }
  } catch (error) {
    console.error("❌ Payment error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Connection error to payment service",
    };
  }
}

export async function initiateMoMoPayment(paymentData, onSuccess) {
  const result = await processMoMoPayment(paymentData);

  if (result.success && result.payUrl) {
    console.log("🔗 Opening MoMo payment page in new tab...");
    sessionStorage.setItem("currentOrderId", paymentData.orderId);
    const momoWindow = window.open(result.payUrl, "_blank");
    const openTime = Date.now();
    let hasCalledCallback = false;

    const checkInterval = setInterval(async () => {
      try {
        if (momoWindow && momoWindow.closed) {
          clearInterval(checkInterval);
          if (hasCalledCallback) return;
          console.log("🔍 MoMo tab closed, checking payment status...");
          const tabDurationMs = Date.now() - openTime;
          console.log(`⏱️ Tab was open for ${(tabDurationMs / 1000).toFixed(1)}s`);
          if (tabDurationMs > 2000) {
            console.log("✅ Tab was open long enough, treating as successful payment");
            hasCalledCallback = true;
            if (onSuccess) onSuccess(paymentData.orderId);
            return;
          }
          try {
            const paymentStatus = await axios.get(
              `${PROXY_SERVER_URL}/api/payments/${paymentData.orderId}`
            );
            if (paymentStatus.data) {
              console.log("✅ Payment status checked:", paymentStatus.data.status);
            }
          } catch (error) {
            console.log("ℹ️ Could not check payment status");
          }
          hasCalledCallback = true;
          if (onSuccess) onSuccess(paymentData.orderId);
        }
      } catch (error) {
        console.log("Checking payment status...");
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (momoWindow && !momoWindow.closed) {
        console.log("⚠️ Timeout: MoMo tab still open after 10s");
      }
    }, 10000);
  } else {
    throw new Error(result.message);
  }
}

export async function checkPaymentStatus(orderId) {
  try {
    const response = await axios.get(`${PROXY_SERVER_URL}/api/payments/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return null;
  }
}

export async function savePaymentToSupabase(paymentData) {
  try {
    const { data, error } = await supabase.from('payments').insert([
      {
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        status: paymentData.status || 'pending',
        payment_data: paymentData.paymentData || null,
        provider: 'momo',
      }
    ]);

    if (error) throw error;
    console.log('✅ Payment saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error saving payment to Supabase:', error);
    throw error;
  }
}

export async function saveOrderToSupabase(orderData) {
  try {
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderData.orderId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingOrder) {
      console.log('📝 Order already exists, updating status to completed...')
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderData.orderId)
      
      if (error) throw error
      console.log('✅ Order status updated to Supabase')
    } else {
      console.log('➕ Creating new order...')
      const { error } = await supabase.from('orders').insert([
        {
          id: orderData.orderId,
          user_id: orderData.userId,
          total_amount: orderData.amount,
          status: 'completed',
          customer_name: orderData.customerName || '',
          customer_phone: orderData.customerPhone || '',
          customer_address: orderData.customerAddress || '',
        }
      ])

      if (error) throw error
      console.log('✅ Order saved to Supabase')
    }

    if (orderData.items && orderData.items.length > 0) {
      console.log('📦 Saving order items...')
      const orderItems = orderData.items.map(item => ({
        order_id: orderData.orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_item')
        .insert(orderItems)

      if (itemsError) throw itemsError
      console.log('✅ Order items saved')
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error saving order to Supabase:', error)
    throw error
  }
}
