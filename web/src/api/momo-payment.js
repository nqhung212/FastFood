import axios from "axios";

const PROXY_SERVER_URL = "http://localhost:5001";

/**
 * Call MoMo Sandbox payment API (low-level API call)
 * @param {Object} paymentData
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
    }

    console.error("❌ MoMo response error:", response.data);
    return { success: false, message: response.data.message || "Unable to create payment request" };
  } catch (error) {
    console.error("❌ Payment error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Connection error to payment service" };
  }
}

/**
 * Check payment status from proxy/payment API
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

