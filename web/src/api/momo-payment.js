import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const PROXY_SERVER_URL = "http://localhost:4001";

/**
 * Call MoMo Sandbox payment API
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.amount - Amount (VND)
 * @param {string} paymentData.orderId - Order ID
 * @param {string} paymentData.orderInfo - Order description
 * @param {Array} paymentData.items - Items list
 * @returns {Promise<Object>} { success, payUrl, message }
 */
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

/**
 * Initiate MoMo payment - open new tab and monitor
 * @param {Object} paymentData - Payment data
 * @param {Function} onSuccess - Callback when payment succeeds
 */
export async function initiateMoMoPayment(paymentData, onSuccess) {
  const result = await processMoMoPayment(paymentData);

  if (result.success && result.payUrl) {
    console.log("🔗 Opening MoMo payment page in new tab...");
    
    // Save orderId to sessionStorage for tracking
    sessionStorage.setItem("currentOrderId", paymentData.orderId);
    
    // Mở tab mới
    const momoWindow = window.open(result.payUrl, "_blank");
    const openTime = Date.now();
    let hasCalledCallback = false;
    
    // Monitor MoMo tab - check every 2 seconds
    const checkInterval = setInterval(async () => {
      try {
        // Nếu tab MoMo đã đóng
        if (momoWindow && momoWindow.closed) {
          clearInterval(checkInterval);
          
          if (hasCalledCallback) return; // Prevent double callback
          
          console.log("🔍 MoMo tab closed, checking payment status...");
          
          // Get time tab was opened
          const tabDurationMs = Date.now() - openTime;
          console.log(`⏱️ Tab was open for ${(tabDurationMs / 1000).toFixed(1)}s`);
          
          // If tab was open for more than 2 seconds, consider payment successful
          if (tabDurationMs > 2000) {
            console.log("✅ Tab was open long enough, treating as successful payment");
            hasCalledCallback = true;
            if (onSuccess) onSuccess(paymentData.orderId);
            return;
          }
          
          // Otherwise, check API for actual payment status
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
          
          // Always redirect to payment-success page
          hasCalledCallback = true;
          if (onSuccess) onSuccess(paymentData.orderId);
        }
      } catch (error) {
        console.log("Checking payment status...");
      }
    }, 2000);
    
    // Stop checking after 10 seconds if tab not closed
    setTimeout(() => {
      clearInterval(checkInterval);
      if (momoWindow && !momoWindow.closed) {
        console.log("⚠️ Timeout: MoMo tab still open after 10s");
        // User is still on MoMo page, don't force redirect yet
      }
    }, 10000);
  } else {
    throw new Error(result.message);
  }
}

/**
 * Check payment status - called from payment-success page
 */
export async function checkPaymentStatus(orderId) {
  try {
    const response = await axios.get(`${PROXY_SERVER_URL}/api/payments/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return null;
  }
}

/**
 * Save payment to Supabase
 */
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

/**
 * Save order to Supabase (called after payment success)
 * Checks if order exists first - if yes, updates status; if no, inserts new
 */
export async function saveOrderToSupabase(orderData) {
  try {
    // First check if order already exists using maybeSingle() instead of single()
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderData.orderId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingOrder) {
      // Order already exists, just update status to completed
      console.log('📝 Order already exists, updating status to completed...')
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderData.orderId)
      
      if (error) throw error
      console.log('✅ Order status updated to Supabase')
      return { success: true }
    } else {
      // Order doesn't exist, insert new one
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
      return { success: true }
    }
  } catch (error) {
    console.error('❌ Error saving order to Supabase:', error)
    throw error
  }
}

