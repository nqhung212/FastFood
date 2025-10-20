import express from "express";
import cors from "cors";
import crypto from "crypto";
import axios from "axios";
// Using in-memory map for payments (no file persistence)

const app = express();
const PORT = process.env.PORT || 4001;

// MoMo Sandbox Configuration - per official guide
const MOMO_CONFIG = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: process.env.REDIRECT_URL || "http://localhost:3000/payment-success",
  cancelUrl: process.env.CANCEL_URL || "http://localhost:3000/payment-cancel",
  requestType: "captureWallet",
};

app.use(cors());
app.use(express.json());

const paymentsMap = new Map();

// Tạo HMAC SHA256 signature theo đúng format MoMo
function generateSignature(data, secretKey) {
  // Format: accessKey=...&amount=...&extraData=...&ipnUrl=...&orderId=...&orderInfo=...&partnerCode=...&redirectUrl=...&requestId=...&requestType=...
  const rawSignature = `accessKey=${data.accessKey}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
  
  console.log("📝 Raw Signature:", rawSignature);
  
  return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
}

// POST /api/momo/checkout - Tạo request thanh toán MoMo
app.post("/api/momo/checkout", async (req, res) => {
  try {
    const { amount, orderId, orderInfo, items } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, orderId",
      });
    }

    // Chuẩn bị dữ liệu theo format chính xác của MoMo
    const requestId = `${MOMO_CONFIG.partnerCode}${Date.now()}`;
  const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"; // Replace with your real IPN URL
    const extraData = ""; // Pass empty value if merchant doesn't have stores
    
    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: orderInfo || "FastFood Order",
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: MOMO_CONFIG.requestType,
      lang: "vi",
    };

  // Create signature
    const signature = generateSignature(requestData, MOMO_CONFIG.secretKey);
    requestData.signature = signature;

    console.log("📤 Sending request to MoMo:");
    console.log("   Order ID:", orderId);
    console.log("   Amount:", amount);
    console.log("   Request ID:", requestId);

    // Gọi MoMo API
    const momoResponse = await axios.post(MOMO_CONFIG.endpoint, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ MoMo Response:");
    console.log("   Result Code:", momoResponse.data.resultCode);
    console.log("   Message:", momoResponse.data.message);
    console.log("   Pay URL:", momoResponse.data.payUrl ? "✓ Available" : "✗ Not available");

  // Save payment information
    const paymentRecord = {
      orderId,
      amount,
      orderInfo,
      items: items || [],
      requestId: requestId,
      timestamp: new Date().toISOString(),
      status: "pending",
      momoTransId: momoResponse.data.transId,
      momoResultCode: momoResponse.data.resultCode,
    };

    // Save to in-memory store
    paymentsMap.set(orderId, paymentRecord);

  // Check result
    if (momoResponse.data.resultCode === 0 && momoResponse.data.payUrl) {
      return res.json({
        success: true,
        orderId,
        payUrl: momoResponse.data.payUrl,
        message: "Payment request created successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: momoResponse.data.message || "Unable to create payment request",
        resultCode: momoResponse.data.resultCode,
      });
    }
  } catch (error) {
    console.error("❌ Server Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "MoMo connection error: " + (error.response?.data?.message || error.message),
      details: error.response?.data,
    });
  }
});

// POST /api/momo/ipn - Receive IPN callback from MoMo
app.post("/api/momo/ipn", (req, res) => {
  try {
    const { orderId, resultCode, message, transId } = req.body;

    console.log("📨 IPN from MoMo:", {
      orderId,
      resultCode,
      transId,
    });

  // Update payment status
    const payment = paymentsMap.get(orderId);
    if (payment) {
      payment.status = resultCode === 0 ? "success" : "failed";
      payment.resultCode = resultCode;
      payment.transId = transId;
      payment.ipnTimestamp = new Date().toISOString();
      // update map entry
      paymentsMap.set(orderId, payment);
    }

    res.json({ message: "Received" });
  } catch (error) {
    console.error("IPN Error:", error);
    res.status(500).json({ error: "IPN processing error" });
  }
});

// GET /api/payments - Get list of payments
app.get("/api/payments", (req, res) => {
  try {
    const payments = Array.from(paymentsMap.values());
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error reading payments" });
  }
});

// GET /api/payments/:orderId - Get payment details by orderId
app.get("/api/payments/:orderId", (req, res) => {
  try {
    const payment = paymentsMap.get(req.params.orderId);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error reading payments" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Payment server running on http://localhost:${PORT}`);
  console.log(`📌 MoMo Sandbox Mode`);
  console.log(`🔗 MoMo API: ${MOMO_CONFIG.endpoint}\n`);
});

