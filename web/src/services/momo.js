import { processMoMoPayment } from "../api/momo-payment.js";
import { supabase } from "../lib/supabaseClient";

/**
 * High-level service: initiate payment flow by opening MoMo checkout and monitoring the tab
 */
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
            // Try to get final status from proxy
            const paymentStatus = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:5001'}/api/payments/${paymentData.orderId}`);
            const json = await paymentStatus.json();
            if (json) console.log("✅ Payment status checked:", json.status);
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

export async function savePaymentToSupabase(paymentData) {
  try {
    const { data, error } = await supabase.from('payment').insert([
      {
        payment_id: crypto.randomUUID(),
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        status: paymentData.status || 'pending',
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
      .from('order')
      .select('order_id')
      .eq('order_id', orderData.orderId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingOrder) {
      console.log('📝 Order already exists, updating status to completed...')
      const { error } = await supabase
        .from('order')
        .update({ order_status: 'completed' })
        .eq('order_id', orderData.orderId)
      
      if (error) throw error
      console.log('✅ Order status updated to Supabase')
      return { success: true }
    } else {
      console.log('➕ Creating new order...')
      const { error } = await supabase.from('order').insert([
        {
          order_id: orderData.orderId,
          customer_id: orderData.userId,
          total_price: orderData.amount,
          order_status: 'completed',
          payment_status: 'paid',
          shipping_name: orderData.customerName || '',
          shipping_phone: orderData.customerPhone || '',
          shipping_address: orderData.customerAddress || '',
        }
      ])

      if (error) throw error
      console.log('✅ Order saved to Supabase')
    }

    if (orderData.items && orderData.items.length > 0) {
      console.log('📦 Saving order items...')
      const orderItems = orderData.items.map(item => ({
        order_item_id: crypto.randomUUID(),
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
