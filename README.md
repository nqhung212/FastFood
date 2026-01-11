# FastFood

Full‑stack food ordering platform with a Web client (React + Vite) and a Mobile app (Expo/React Native), backed by Supabase (Auth + Postgres) and integrated MoMo payment gateway with callback/IPN handling.

### Project Information

- **Timeline:** Completed in 1 month
- **Team:**
  - Hùng - Website (React + Vite)
  - Hậu - Mobile (Expo/React Native)

---

## English

### Tech Stack

- Frontend (Web): React 19, Vite 7, React Router, Axios, Leaflet/React‑Leaflet
- Mobile: Expo (React Native 0.81), Expo Router, React Native Maps, Reanimated, Async Storage
- Backend/Services: Node.js, Express (payment proxy and MoMo servers), CORS, dotenv, morgan
- Auth/Database: Supabase (Auth + Postgres) via @supabase/supabase-js
- Payments: MoMo Sandbox Gateway (captureWallet flow, redirect + IPN)
- Tooling: TypeScript (mobile), ESLint, npm

### Features

- Browse categories, restaurants, products, and product details
- Cart and checkout flows with MoMo payment integration
- Payment callback/IPN handling with order/payment status updates (Supabase)
- Authentication (login/register), profile management, and order history
- Delivery tracking UI (Drone/Map simulator on mobile and web)
- Admin and Restaurant Owner routes/panels scaffolded
- Cross‑platform: responsive web + mobile app via Expo

### Installation

Prerequisites: Node.js 18+, npm, ngrok (for local MoMo callbacks), Android Studio/Xcode if running emulators, and optional Expo Go on device.

1. Web app

```powershell
cd web
npm install
npm run dev
```

2. Web payment proxy (optional for web integration)

```powershell
cd web/server
npm install
npm run dev
```

3. Mobile app (Expo)

```powershell
cd mobile
npm install
npm start
```

Use the on‑screen Expo menu to run on Android/iOS/Web.

4. Mobile MoMo server (handles real callbacks/IPN and writes to Supabase)

```powershell
cd mobile/server
npm install
node index.js

# In another terminal, expose the server for MoMo callbacks
npx ngrok@latest http 4001
```

Copy the generated https URL and set it as `REDIRECT_URL` and `IPN_URL` (see Environment Variables). Example:
Use it for testing payment callbacks.

### Usage

- Web: run `npm run dev` in `web` and open the shown URL.
- Web payment proxy: run in `web/server` if your web flow needs a server‑side MoMo signature.
- Mobile: run `npm start` in `mobile`, then run the MoMo server + ngrok for payment flows.
- Update the mobile app’s checkout service or config to point to your ngrok host when testing payments.

### Project Structure (abridged)

```
FastFood/
├─ mobile/
│  ├─ app/                    # Expo Router screens (tabs, auth, order, payment, profile…)
│  ├─ assets/                 # Styles, images
│  ├─ components/             # Shared UI components
│  ├─ hooks/                  # Data and action hooks (menu, auth, checkout…)
│  ├─ server/                 # MoMo server (Express) for mobile callbacks/IPN
│  └─ service/                # API services (Supabase client, product, checkout…)
│
├─ web/
│  ├─ public/
│  ├─ server/                 # Express server for MoMo payment proxy
│  └─ src/                    # React app (routes, pages, components, context, hooks…)
│
├─ migrations/                # Database migrations/scripts
├─ insertdb.sql, schema_uuid.sql, slinh.sql
└─ README.md
```

###

---

## Tiếng Việt

### Công Nghệ Sử Dụng

- Frontend (Web): React 19, Vite 7, React Router, Axios, Leaflet/React‑Leaflet
- Mobile: Expo (React Native 0.81), Expo Router, React Native Maps, Reanimated, Async Storage
- Backend/Dịch vụ: Node.js, Express (proxy thanh toán & MoMo), CORS, dotenv, morgan
- Auth/CSDL: Supabase (Auth + Postgres) qua @supabase/supabase-js
- Thanh toán: Cổng MoMo Sandbox (captureWallet, redirect + IPN)
- Công cụ: TypeScript (mobile), ESLint, npm

### Tính Năng

- Duyệt danh mục, nhà hàng, sản phẩm, trang chi tiết sản phẩm
- Giỏ hàng và quy trình checkout tích hợp thanh toán MoMo
- Xử lý callback/IPN và cập nhật trạng thái đơn/thanhtoán (Supabase)
- Đăng nhập/đăng ký, quản lý hồ sơ, lịch sử đơn hàng
- Giao diện theo dõi giao hàng (mô phỏng Drone/Map trên mobile và web)
- Khung sườn trang Quản trị và Chủ cửa hàng
- Hỗ trợ đa nền tảng: web responsive + app mobile bằng Expo

### Cài Đặt

Yêu cầu: Node.js 18+, npm, ngrok (cho callback MoMo khi chạy local), Android Studio/Xcode nếu chạy giả lập, và Expo Go (tuỳ chọn).

1. Ứng dụng Web

```powershell
cd web
npm install
npm run dev
```

2. Server proxy thanh toán cho Web (tuỳ chọn)

```powershell
cd web/server
npm install
npm run dev
```

3. Ứng dụng Mobile (Expo)

```powershell
cd mobile
npm install
npm start
```

4. Server MoMo cho Mobile (Express) + ngrok

```powershell
cd mobile/server
npm install
node index.js

# Terminal khác, mở cổng public cho callback
npx ngrok@latest http 4001
```

Sao chép URL https và đặt cho `REDIRECT_URL`, `IPN_URL` như sau:
Sử dụng URL https để thử nghiệm quy trình thanh toán và callback.

### Sử Dụng

- Web: chạy `npm run dev` trong thư mục `web` và mở URL hiển thị.
- Web payment proxy: chạy trong `web/server` nếu luồng web cần ký MoMo phía server.
- Mobile: chạy `npm start` trong `mobile`, rồi khởi động MoMo server + ngrok để test thanh toán.
- Cập nhật cấu hình/checkout service của mobile để trỏ tới domain ngrok khi test.

### Cấu Trúc Dự Án (rút gọn)

```
FastFood/
├─ mobile/
│  ├─ app/         # Màn hình (tabs, auth, order, payment, profile…)
│  ├─ server/      # MoMo server (Express) cho callback/IPN
│  └─ service/     # Dịch vụ (Supabase client, product, checkout…)
├─ web/
│  ├─ server/      # Express proxy cho thanh toán MoMo
│  └─ src/         # Ứng dụng React (routes, pages, components…)
└─ README.md
```

###

---

Notes

- Do not commit `node_modules/`.
- Keep secrets out of source control. Use `.env` and `.env.example`.
