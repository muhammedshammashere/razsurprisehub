# Installation Guide — Raz Surprise Hub

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9+
- **MongoDB Atlas** account ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- **Razorpay** test account ([dashboard.razorpay.com](https://dashboard.razorpay.com))

## 1. Clone / open project

```bash
cd surprise-venture
```

## 2. MongoDB Atlas setup

1. Create a free cluster.
2. **Database Access** → Add user with password.
3. **Network Access** → Add IP `0.0.0.0/0` (dev) or your IP.
4. **Connect** → Drivers → copy connection string.
5. Replace `<password>` and set database name: `surprise-venture`.

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
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/surprise-venture
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
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
| Admin | admin@surpriseventure.com  | admin123456    |

Register a normal user via **Sign up** for customer flows.

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
| MongoDB connection failed | Check URI, IP whitelist, credentials |
| CORS errors | Set `CLIENT_URL` to exact frontend origin |
| Razorpay not opening | Verify `VITE_RAZORPAY_KEY_ID` and server keys match (test mode) |
| 401 on protected routes | Login again; check `JWT_SECRET` unchanged |
