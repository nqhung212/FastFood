npm start
Server sẽ chạy tại: `http://localhost:4001`

## 📌 API Endpoints

### POST `/api/momo/checkout`

Tạo request thanh toán MoMo

**Request body:**

```json
{
  "amount": 50000,
  "orderId": "ORDER_1234567890",
  "orderInfo": "Thanh toán đơn hàng",
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
  "message": "Tạo yêu cầu thanh toán thành công"
}
```

### POST `/api/momo/ipn`

Nhận callback từ MoMo (IPN - Instant Payment Notification)

### GET `/api/payments`

Lấy danh sách tất cả các thanh toán

### GET `/api/payments/:orderId`

Lấy chi tiết thanh toán theo Order ID

## 🔐 Cấu Hình MoMo Sandbox

- **Partner Code**: `MOMERTEST`
- **Access Key**: `F323D61F2F5A9FDE`
- **Secret Key**: `9FD6E102FFDAC69D3B5A3FC3EE6F2D61`
- **Endpoint**: `https://test-payment.momo.vn/v2/gateway/api/create`

## 🔒 Security

- Tất cả request được ký bằng HMAC SHA256
- Secret key được bảo vệ trong environment variable
- Signature được xác minh với MoMo API

## 📊 Dữ Liệu

Thông tin thanh toán được lưu trong `payments.json`:

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

- Server này là để test trên MoMo Sandbox
- Không dùng cho production mà không thay đổi cấu hình
- Đảm bảo server chạy trước khi gọi API từ frontend
- Frontend redirect URL: `http://localhost:3000/payment-success`
