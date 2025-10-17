# FastFood - Hướng Dẫn Thanh Toán MoMo

## Cấu trúc đã được thêm

### Frontend (Web)

1. **cart.jsx** - Cập nhật: Thêm nút "Thanh Toán" và tính tổng tiền
2. **checkout.jsx** - Trang chọn phương thức thanh toán (MoMo)
3. **payment-success.jsx** - Trang thông báo thanh toán thành công
4. **momo-payment.js** - API client kết nối đến proxy server
5. **routes/index.jsx** - Cập nhật: Thêm route /checkout và /payment-success

### Backend (Proxy Server - Port 4001)

- **server/server.js** - Express server giả lập MoMo API
- **server/package.json** - Dependencies (express, cors)
- **server/payments.json** - Lưu trữ dữ liệu thanh toán

## Cách sử dụng

### 1. Chạy Proxy Server (Port 4001)

```bash
cd c:\Workspace\Github\FastFood\server
npm start
```

### 2. Chạy Frontend (Port 5173 hoặc port vite mặc định)

```bash
cd c:\Workspace\Github\FastFood\web
npm run dev
```

### 3. Flow thanh toán

- Thêm sản phẩm vào giỏ hàng
- Nhấn "Thanh Toán" từ trang /cart
- Dữ liệu giỏ hàng lưu vào sessionStorage
- Chuyển đến trang /checkout để chọn phương thức thanh toán
- Chọn MoMo và nhấn "Thanh Toán"
- Server proxy xử lý thanh toán (giả lập)
- Lưu thông tin vào payments.json
- Hiển thị trang thành công /payment-success
- Giỏ hàng được làm trống

## Dữ liệu thanh toán

Tất cả thông tin thanh toán được lưu vào:

```
server/payments.json
```

Mỗi giao dịch chứa:

- orderId
- amount
- orderInfo
- items (danh sách sản phẩm)
- timestamp
- status
- transactionId

## API Endpoints

- `POST /api/momo/checkout` - Xử lý thanh toán
- `GET /api/payments` - Xem tất cả thanh toán
- `GET /api/payments/:orderId` - Xem chi tiết thanh toán
