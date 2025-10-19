npm start
Server will run at: `http://localhost:4001`

## 📌 API Endpoints

### POST `/api/momo/checkout`

Create MoMo payment request

**Request body:**

```json
{
  "amount": 50000,
  "orderId": "ORDER_1234567890",
  "orderInfo": "Payment for order",
  "items": [
    {
      "id": 1,
      "name": "Burger",
      "price": 65000,
      "quantity": 1
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "orderId": "ORDER_1234567890",
  "payUrl": "https://test-payment.momo.vn/...",
  "message": "Payment request created successfully"
}
```

### POST `/api/momo/ipn`

Receive IPN callback from MoMo (Instant Payment Notification)

### GET `/api/payments`

Get list of all payments

### GET `/api/payments/:orderId`

Get payment details by Order ID

## 🔐 MoMo Sandbox Configuration

## 🔒 Security

- All requests are signed by HMAC SHA256
- Secret key should be stored in environment variable

## 📊 Data

Payment records are stored in `payments.json`:

```json
{
  "orderId": "ORDER_1234567890",
  "amount": 50000,
  "status": "pending|success|failed",
  "timestamp": "2025-10-17T10:30:00.000Z",
  "momoTransId": "...",
  "momoResultCode": 0
}
```

## 🧪 Test

```bash
node test-payment.js
```

## ⚠️ Lưu ý

## ⚠️ Notes

- This server is for testing with MoMo Sandbox
- Not for production without configuration changes
- Ensure the server is running before calling APIs from the frontend
- Frontend redirect URL: `http://localhost:3000/payment-success`

- Server is for MoMo Sandbox testing only
- Not for production without configuration changes
- Ensure the server is running before calling APIs from the frontend
- Frontend redirect URL: `http://localhost:3000/payment-success`
