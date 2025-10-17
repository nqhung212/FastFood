import axios from "axios";

const PROXY_SERVER_URL = "http://localhost:4001";

/**
 * Gọi API thanh toán MoMo Sandbox
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {number} paymentData.amount - Số tiền (VNĐ)
 * @param {string} paymentData.orderId - ID đơn hàng
 * @param {string} paymentData.orderInfo - Mô tả đơn hàng
 * @param {Array} paymentData.items - Danh sách sản phẩm
 * @returns {Promise<Object>} { success, payUrl, message }
 */
export async function processMoMoPayment(paymentData) {
  try {
    console.log("🔄 Processing MoMo payment for order:", paymentData.orderId);

    const response = await axios.post(`${PROXY_SERVER_URL}/api/momo/checkout`, {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderInfo: paymentData.orderInfo || "Thanh toán đơn hàng",
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
        message: response.data.message || "Không thể tạo yêu cầu thanh toán",
      };
    }
  } catch (error) {
    console.error("❌ Payment error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối đến dịch vụ thanh toán",
    };
  }
}

/**
 * Khởi tạo thanh toán MoMo - Mở tab mới và monitor
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {Function} onSuccess - Callback khi thanh toán thành công
 */
export async function initiateMoMoPayment(paymentData, onSuccess) {
  const result = await processMoMoPayment(paymentData);

  if (result.success && result.payUrl) {
    console.log("🔗 Opening MoMo payment page in new tab...");
    
    // Lưu orderId vào sessionStorage để tracking
    sessionStorage.setItem("currentOrderId", paymentData.orderId);
    
    // Mở tab mới
    const momoWindow = window.open(result.payUrl, "_blank");
    
    // Monitor tab MoMo - kiểm tra mỗi 2 giây
    const checkInterval = setInterval(async () => {
      try {
        // Nếu tab MoMo đã đóng
        if (momoWindow && momoWindow.closed) {
          clearInterval(checkInterval);
          console.log("🔍 MoMo tab closed, checking payment status...");
          
          // Gọi API kiểm tra trạng thái thanh toán
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
    
    // Dừng check sau 5 phút nếu tab không đóng
    setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000);
  } else {
    throw new Error(result.message);
  }
}

/**
 * Check payment status - gọi từ payment-success page
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

