# Dependencies & Ports Reference - FastFood Project

## 🚀 Development Ports

### Mobile App (React Native + Expo)

```bash
Port: 8081 (Expo Dev Server)
Metro bundler: 19000, 19001, 19002
```

### Web App (React + Vite)

```bash
Dev Server: 5173 (Vite default)
Preview: 4173
```

### Payment Server (Node.js/Express)

```bash
Local: 3000
Production: Process.env.PORT || 3000
```

### Database & Cloud Services

```bash
Supabase PostgreSQL: 5432 (internal)
Supabase API: 443 (HTTPS)
Supabase Realtime: 443 (WSS)
MoMo API: 443 (HTTPS)
```

## 📦 Dependencies Breakdown

### Mobile App Dependencies

```json
{
  "runtime": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.75.1",
    "expo": "~54.0.12",
    "expo-router": "~6.0.12",
    "react-native": "0.76.1"
  },
  "server": {
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "crypto": "^1.0.1",
    "dotenv": "^17.2.3",
    "express": "^4.18.2"
  }
}
```

### Web App Dependencies

```json
{
  "runtime": {
    "@supabase/supabase-js": "^2.75.1",
    "axios": "^1.12.2",
    "crypto-js": "^4.2.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.4"
  },
  "build": {
    "@vitejs/plugin-react": "^5.0.4",
    "vite": "^7.1.7"
  }
}
```

## 🔌 Connection Protocols & APIs

### Client ↔ Supabase

```
Protocol: HTTPS/WSS
Endpoint: https://uuxtbxkgnktfcbdevbmx.supabase.co
Authentication: JWT Bearer tokens
API Type: REST + Realtime WebSocket

Headers:
- Authorization: Bearer <jwt_token>
- apikey: <anon_key>
- Content-Type: application/json
```

### Client ↔ Payment Server

```
Protocol: HTTPS
Local: http://localhost:3000
Production: https://your-server.com

Endpoints:
- POST /api/momo/checkout
- POST /api/momo/callback
- GET /api/momo/status/:orderId

Headers:
- Content-Type: application/json
- Origin: <client_domain>
```

### Payment Server ↔ MoMo API

```
Protocol: HTTPS
Endpoint: https://test-payment.momo.vn (sandbox)
          https://payment.momo.vn (production)

Authentication: HMAC-SHA256 signature
Required env vars:
- MOMO_PARTNER_CODE
- MOMO_ACCESS_KEY
- MOMO_SECRET_KEY
```

### Payment Server ↔ Supabase

```
Protocol: HTTPS
Authentication: Service Role Key (full access)

Environment variables:
- SUPABASE_URL=https://uuxtbxkgnktfcbdevbmx.supabase.co
- SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## 🛡️ Security & Environment

### Mobile App Environment (.env)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://uuxtbxkgnktfcbdevbmx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
PAYMENT_SERVER_URL=http://localhost:3000  # Dev
PAYMENT_SERVER_URL=https://your-server.com  # Prod
```

### Web App Environment (.env)

```bash
VITE_SUPABASE_URL=https://uuxtbxkgnktfcbdevbmx.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_PAYMENT_SERVER_URL=http://localhost:3000  # Dev
VITE_PAYMENT_SERVER_URL=https://your-server.com  # Prod
```

### Payment Server Environment (.env)

```bash
# Supabase
SUPABASE_URL=https://uuxtbxkgnktfcbdevbmx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# MoMo Payment
MOMO_PARTNER_CODE=<partner_code>
MOMO_ACCESS_KEY=<access_key>
MOMO_SECRET_KEY=<secret_key>
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# Callbacks
REDIRECT_URL=https://your-app.com/payment-result
IPN_URL=https://your-server.com/api/momo/callback

# Server
PORT=3000
NODE_ENV=development
```

## 🔄 Data Flow Patterns

### Authentication Flow

```
1. Client → POST /auth/login (Supabase:443)
2. Supabase → JWT token response
3. Client stores token (AsyncStorage/LocalStorage)
4. Subsequent requests include Authorization header
```

### Product Catalog Flow

```
1. Client → GET /rest/v1/products (Supabase:443)
2. Client → GET /rest/v1/categories (Supabase:443)
3. Real-time updates via WebSocket (Supabase:443/WSS)
```

### Order & Payment Flow

```
1. Client → POST /rest/v1/orders (Supabase:443)
2. Client → POST /api/momo/checkout (Payment Server:3000)
3. Payment Server → POST /v2/gateway/api/create (MoMo:443)
4. MoMo → POST /api/momo/callback (Payment Server:3000)
5. Payment Server → PATCH /rest/v1/orders (Supabase:443)
6. Supabase → Real-time notification (Client via WSS)
```

## 📋 Network Configuration Checklist

### Development Setup

- [ ] Expo CLI installed and configured
- [ ] Vite dev server accessible on 5173
- [ ] Payment server running on 3000
- [ ] All environment variables set
- [ ] Network accessible between services

### Production Deployment

- [ ] Mobile app published to app stores
- [ ] Web app deployed to hosting (Netlify/Vercel)
- [ ] Payment server deployed (Railway/Heroku)
- [ ] Environment variables configured in hosting
- [ ] CORS settings updated for production domains
- [ ] SSL certificates configured
- [ ] Webhook URLs updated in MoMo dashboard

### Security Considerations

- [ ] Service role key secured (server-side only)
- [ ] Anon key has proper RLS policies
- [ ] CORS configured for allowed origins
- [ ] MoMo credentials secured
- [ ] HTTPS enforced in production
- [ ] Input validation on all endpoints
