import axios from "axios";

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
    
  // Monitor MoMo tab - check every 2 seconds
    const checkInterval = setInterval(async () => {
      try {
        // Nếu tab MoMo đã đóng
        if (momoWindow && momoWindow.closed) {
          clearInterval(checkInterval);
          console.log("🔍 MoMo tab closed, checking payment status...");
          
          // Call API to check payment status
          const paymentStatus = await axios.get(
            `${PROXY_SERVER_URL}/api/payments/${paymentData.orderId}`
          );
          
          if (paymentStatus.data && paymentStatus.data.status === "success") {
            console.log("✅ Payment successful!");
            if (onSuccess) onSuccess(paymentData.orderId);
          } else {
            console.log("⏳ Payment still pending or failed");
          }
        }
      } catch (error) {
        console.log("Checking payment status...");
      }
    }, 2000);
    
    // Stop checking after 5 minutes if tab not closed
    setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000);
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

