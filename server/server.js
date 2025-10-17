import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());

const paymentsFile = path.join(__dirname, "payments.json");

function ensurePaymentsFile() {
  if (!fs.existsSync(paymentsFile)) {
    fs.writeFileSync(paymentsFile, JSON.stringify([]));
  }
}

function savePayment(paymentData) {
  ensurePaymentsFile();
  const payments = JSON.parse(fs.readFileSync(paymentsFile, "utf-8"));
  payments.push(paymentData);
  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
}

function getPayments() {
  ensurePaymentsFile();
  return JSON.parse(fs.readFileSync(paymentsFile, "utf-8"));
}

app.post("/api/momo/checkout", (req, res) => {
  const { amount, orderId, orderInfo, items, timestamp } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const paymentData = {
    orderId,
    amount,
    orderInfo,
    items: items || [],
    timestamp: timestamp || new Date().toISOString(),
    status: "success",
    transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    savePayment(paymentData);
    console.log(`✅ Payment saved: ${orderId} - Amount: ${amount}₫`);
    res.json({
      success: true,
      orderId: paymentData.orderId,
      transactionId: paymentData.transactionId,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("❌ Error saving payment:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
    });
  }
});

app.get("/api/payments", (req, res) => {
  try {
    const payments = getPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error reading payments" });
  }
});

app.get("/api/payments/:orderId", (req, res) => {
  try {
    const payments = getPayments();
    const payment = payments.find((p) => p.orderId === req.params.orderId);
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
  console.log(`Payment proxy server running on http://localhost:${PORT}`);
  console.log(`MoMo sandbox endpoint: http://localhost:${PORT}/api/momo/checkout`);
});
