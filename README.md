# FASTFOOD README

---

## Cách chạy

- Web (thư mục `web`):

  ```powershell
  cd web
  npm install (lần đầu clone)
  npm run dev
  ```

- Mobile (thư mục `mobile`):
  ````Cài đặt ngrok
  chạy file index.js: cd mobile/server
                      node index.js
  chạy ngrok(server riêng): ngrok http 4001
  lấy địa chỉ IP của ngrok gán vào .env
  REDIRECT_URL=https://ingenuous-absolutely-cletus.ngrok-free.dev/api/momo/callback
  IPN_URL=https://ingenuous-absolutely-cletus.ngrok-free.dev/api/momo/callback
  dán IP vào địa biến(checkoutService):
               const MOMO_SERVER_URL = "https://ingenuous-absolutely-cletus.ngrok-free.dev";
  ```powershell
  cd mobile
  npm install (lần đầu clone)
  npm start
  ````

---

## API

chạy json-server

```powershell
cd server
npm start
```

---

## Git

- KHÔNG push `node_modules/`.
