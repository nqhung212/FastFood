# Connection Patterns & Port Summary

## 🔌 Quick Reference Table

| Component              | Port        | Protocol       | Purpose               | Dependencies          |
| ---------------------- | ----------- | -------------- | --------------------- | --------------------- |
| **Mobile App (Dev)**   | 8081        | HTTP           | Expo Dev Server       | expo, metro-bundler   |
| **Mobile App (Metro)** | 19000-19002 | HTTP/WebSocket | Hot reload, debugging | react-native, expo    |
| **Web App (Dev)**      | 5173        | HTTP/WebSocket | Vite dev server + HMR | vite, react           |
| **Payment Server**     | 3000        | HTTP/HTTPS     | Express API server    | express, cors, crypto |
| **Supabase API**       | 443         | HTTPS          | REST API endpoints    | @supabase/supabase-js |
| **Supabase Realtime**  | 443         | WSS            | WebSocket real-time   | @supabase/realtime-js |
| **PostgreSQL**         | 5432        | TCP            | Database (internal)   | supabase managed      |
| **MoMo API**           | 443         | HTTPS          | Payment processing    | node-fetch, crypto    |

## 📡 Connection Matrix

### Development Environment

```
┌─────────────────┬──────────┬─────────────┬──────────────┐
│ Source          │ Target   │ Port/Proto  │ Purpose      │
├─────────────────┼──────────┼─────────────┼──────────────┤
│ Mobile Device   │ Dev Mac  │ 8081/HTTP   │ Expo Dev     │
│ Browser         │ Dev Mac  │ 5173/HTTP   │ Vite Dev     │
│ Mobile/Web      │ Dev Mac  │ 3000/HTTP   │ Payment API  │
│ Mobile/Web      │ Supabase │ 443/HTTPS   │ Database API │
│ Mobile/Web      │ Supabase │ 443/WSS     │ Real-time    │
│ Payment Server  │ Supabase │ 443/HTTPS   │ DB Updates   │
│ Payment Server  │ MoMo     │ 443/HTTPS   │ Payment      │
│ MoMo            │ Dev Mac  │ 3000/HTTPS  │ Webhook      │
└─────────────────┴──────────┴─────────────┴──────────────┘
```

### Production Environment

```
┌─────────────────┬──────────┬─────────────┬──────────────┐
│ Source          │ Target   │ Port/Proto  │ Purpose      │
├─────────────────┼──────────┼─────────────┼──────────────┤
│ Mobile App      │ Supabase │ 443/HTTPS   │ Database API │
│ Web App         │ Supabase │ 443/HTTPS   │ Database API │
│ Mobile App      │ Server   │ 443/HTTPS   │ Payment API  │
│ Web App         │ Server   │ 443/HTTPS   │ Payment API  │
│ Payment Server  │ Supabase │ 443/HTTPS   │ DB Updates   │
│ Payment Server  │ MoMo     │ 443/HTTPS   │ Payment      │
│ MoMo            │ Server   │ 443/HTTPS   │ Webhook      │
│ Users           │ App Store│ 443/HTTPS   │ App Download │
│ Users           │ Web Host │ 443/HTTPS   │ Web Access   │
└─────────────────┴──────────┴─────────────┴──────────────┘
```

## 🛠️ Development Commands

### Start Development Environment

```bash
# Terminal 1: Mobile App
cd mobile/
npm start
# Opens on port 8081, Metro on 19000-19002

# Terminal 2: Web App
cd web/
npm run dev
# Opens on port 5173

# Terminal 3: Payment Server
cd mobile/server/  # or web/server/
npm start
# Opens on port 3000
```

### Environment Health Check

```bash
# Check if ports are available
lsof -i :8081  # Expo
lsof -i :5173  # Vite
lsof -i :3000  # Payment Server
lsof -i :19000 # Metro

# Test connections
curl http://localhost:3000/health
curl http://localhost:5173/
```

## 🔐 Security Considerations

### Development Security

- ✅ Use HTTPS for Supabase connections
- ✅ Store secrets in .env files (gitignored)
- ✅ Use anon key for client-side Supabase
- ✅ Use service role key only on payment server
- ⚠️ Payment server accepts HTTP in dev (localhost only)

### Production Security

- ✅ All connections use HTTPS/WSS
- ✅ CORS configured for specific domains
- ✅ Environment variables in hosting platform
- ✅ MoMo webhook signature verification
- ✅ Supabase RLS policies enabled
- ✅ Rate limiting on payment endpoints

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] Update environment variables
- [ ] Configure CORS for production domains
- [ ] Update MoMo webhook URLs
- [ ] Test payment flow in sandbox
- [ ] Verify Supabase RLS policies

### Mobile App Deployment

- [ ] Build production APK/IPA
- [ ] Update API endpoints to production
- [ ] Test on physical devices
- [ ] Submit to app stores

### Web App Deployment

- [ ] Build with production config
- [ ] Deploy to hosting platform
- [ ] Configure custom domain + SSL
- [ ] Test payment integration

### Payment Server Deployment

- [ ] Deploy to cloud platform
- [ ] Configure environment variables
- [ ] Set up monitoring/logging
- [ ] Update MoMo webhook URL
- [ ] Test IPN callbacks
