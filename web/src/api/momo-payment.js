import axios from "axios";

const MOMO_FAKE_KEY = "F8BF9D5FA9D7BDA3";
const PROXY_SERVER_URL = "http://localhost:4001";

export async function processMoMoPayment(paymentData) {
  try {
    const response = await axios.post(`${PROXY_SERVER_URL}/api/momo/checkout`, {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderInfo: paymentData.orderInfo,
      items: paymentData.items,
      timestamp: new Date().toISOString(),
    });

    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        orderId: response.data.orderId,
        message: "Thanh toán thành công",
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Thanh toán thất bại",
      };
    }
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      message: "Lỗi kết nối đến dịch vụ thanh toán",
    };
  }
}

export function getMoMoCheckoutUrl(paymentData) {
  const params = new URLSearchParams({
    amount: paymentData.amount,
    orderId: paymentData.orderId,
    orderInfo: paymentData.orderInfo,
    apiKey: MOMO_FAKE_KEY,
    returnUrl: `${window.location.origin}/momo-callback?orderId=${paymentData.orderId}`,
  });
  return `https://developers.momo.vn/v3/vi/checkout?${params.toString()}`;
}

export function getMoMoLink(amount, orderId, orderInfo) {
  const params = new URLSearchParams({
    amount,
    orderId,
    orderInfo,
    apiKey: MOMO_FAKE_KEY,
  });
  return `https://developers.momo.vn/v3/vi/checkout?${params.toString()}`;
}
