import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const router = express.Router();

const {
  MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
  MOMO_ENDPOINT,
  REDIRECT_URL,
  IPN_URL,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ====== TẠO THANH TOÁN MOMO ======
router.post("/checkout", async (req, res) => {
  try {
    const { amount, orderInfo, orderId: clientOrderId } = req.body;

    // ⚙️ Dùng orderId thật từ Supabase hoặc fallback UUID nếu test
    const orderId = clientOrderId || crypto.randomUUID();
    const requestId = orderId;

    // 🧾 Đảm bảo có order trong bảng (tránh lỗi foreign key)
    const { error: insertOrderError } = await supabase
      .from("orders")
      .insert([{ id: orderId, status: "pending", total_amount: amount }])
      .select("id");
    if (insertOrderError)
      console.warn("⚠️ Có thể order đã tồn tại:", insertOrderError.message);

    // ✅ Tạo chữ ký MoMo
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${REDIRECT_URL}&requestId=${requestId}&requestType=captureWallet`;
    const signature = crypto
      .createHmac("sha256", MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: REDIRECT_URL,
      ipnUrl: IPN_URL,
      requestType: "captureWallet",
      extraData: "",
      lang: "vi",
      signature,
    };

    console.log("📤 Gửi request tới MoMo:", body);

    // 🌐 Gửi yêu cầu đến MoMo thật
    const momoResponse = await fetch(MOMO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await momoResponse.json();

    console.log("💬 MoMo Response:", result);

    // ✅ Gửi phản hồi cho app
    res.json({
      success: result.resultCode === 0,
      payUrl: result.payUrl,
    });

    // 🔁 Giả lập callback sau vài giây (chỉ khi thành công)
    if (result.resultCode === 0) {
      setTimeout(async () => {
        console.log("⏳ Đang gửi callback giả lập...");

        const fakeCallback = {
          partnerCode: MOMO_PARTNER_CODE,
          orderId,
          requestId,
          amount,
          orderInfo,
          orderType: "momo_wallet",
          transId: Date.now(),
          resultCode: 0,
          message: "Thành công (callback giả lập)",
          payType: "qr",
          responseTime: Date.now(),
          extraData: "",
          signature: crypto
            .createHmac("sha256", MOMO_SECRET_KEY)
            .update(`amount=${amount}&orderId=${orderId}&resultCode=0`)
            .digest("hex"),
        };

        await fetch(IPN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fakeCallback),
        });

        console.log("✅ Callback giả lập đã gửi đến:", IPN_URL);
      }, 5000); // 5 giây sau khi tạo QR
    }
  } catch (error) {
    console.error("❌ Lỗi MoMo checkout:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ====== CALLBACK KHI THANH TOÁN THÀNH CÔNG ======
router.post("/callback", async (req, res) => {
  try {
    const data = req.body;
    console.log("💬 Callback nhận từ MoMo:", data);

    const { orderId, amount, resultCode, transId } = data;

    if (resultCode === 0) {
      console.log(`✅ Thanh toán thành công cho đơn hàng ${orderId}`);

      // ✅ Cập nhật trạng thái đơn hàng
      const { error: updateErr } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);
      if (updateErr) console.error("⚠️ Lỗi cập nhật orders:", updateErr);

      // ✅ Thêm bản ghi payment
      const now = new Date().toISOString();
      const { error: payErr } = await supabase.from("payments").insert([
        {
          order_id: orderId,
          payment_id: transId?.toString() || "unknown",
          provider: "momo",
          amount: parseInt(amount),
          status: "success",
          payment_data: JSON.stringify(data),
          created_at: now,
        },
      ]);
      if (payErr) console.error("❌ Lỗi thêm payments:", payErr);
    } else {
      console.warn(`⚠️ Thanh toán thất bại cho đơn ${orderId}`);

      await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);

      await supabase.from("payments").insert([
        {
          order_id: orderId,
          payment_id: transId?.toString() || "unknown",
          provider: "momo",
          amount: parseInt(amount),
          status: "failed",
          payment_data: JSON.stringify(data),
          created_at: new Date().toISOString(),
        },
      ]);
    }

    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    console.error("❌ Lỗi xử lý callback:", err);
    res.status(500).json({ error: "Callback failed" });
  }
});

// ====== KIỂM TRA SERVER HOẠT ĐỘNG ======
router.get("/health", (req, res) => {
  res.json({ status: "ok", momo: true, time: new Date().toISOString() });
});

export default router;
