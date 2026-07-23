# Installation Guide — Raz Surprise Hub

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9+
- **Firebase Project** account ([console.firebase.google.com](https://console.firebase.google.com))
- **Razorpay** test account ([dashboard.razorpay.com](https://dashboard.razorpay.com))

## 1. Clone / open project

```bash
cd surprise-venture
```

## 2. Firebase Database setup

1. Open the Firebase Console and create a new project.
2. Go to **Project Settings** -> **Service Accounts**.
3. Click **Generate new private key** and download the credentials JSON file.
4. Place the credentials JSON file in the `server` directory as `service-account.json`.
5. Enable **Cloud Firestore** database inside your Firebase console in test mode.

## 3. Razorpay setup

1. Sign in to Razorpay Dashboard (Test mode).
2. **Settings → API Keys** → Generate Key ID & Secret.
3. Use test keys in `.env` files.

## 4. Backend setup

```bash
cd server
npm install
```

Copy environment file:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret

# Set the full credentials JSON content as a single line (useful for Render deployments):
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "...", ...}'
```

Seed database (admin + sample products):

```bash
npm run seed
```

Start API:

```bash
npm run dev
```

API health: http://localhost:5000/api/health

## 5. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

Start dev server:

```bash
npm run dev
```

Open http://localhost:5173

## 6. Default credentials

| Role  | Email                      | Password       |
|-------|----------------------------|----------------|
| Admin | admin@razsurprisehub.com   | adminraz@2026  |
| Guest Customer | customer@surpriseventure.com | customer123456 |

Register a normal user via **Sign up** or log in with guest credentials for customer flows.

## 7. Production build

```bash
# Client
cd client && npm run build

# Server
cd server && npm start
```

Serve `client/dist` via CDN/static host; set `CLIENT_URL` to your frontend URL.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Firebase connection failed | Check that `service-account.json` exists in `server/` or `FIREBASE_SERVICE_ACCOUNT` is set correctly in `.env` |
| CORS errors | Set `CLIENT_URL` to exact frontend origin |
| Razorpay not opening | Verify `VITE_RAZORPAY_KEY_ID` and server keys match (test mode) |
| 401 on protected routes | Login again; check `JWT_SECRET` unchanged |
