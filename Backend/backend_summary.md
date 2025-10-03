# Know Before You Go — Backend README

## Overview
This repository contains the backend API for **Know Before You Go**:

- **Node/Express backend** for authentication, events, favorites, and integration with an ML service.
- **Lightweight Python Flask ML service** that reads a precomputed dataset and a trained RandomForest model to predict rainfall (and produce ESI + recommendations).

---

## Main Features
- User registration with hashed password and email OTP verification.
- JWT-based authentication, logout via token blacklisting.
- Forget password + reset via OTP.
- Event creation (with lat/lon) and event weather preview that calls the ML service.
- Favorite events (by eventId uuid).
- ML service endpoints for prediction by direct features or by lat/lon lookup in a dataset.

---

## Quick Links (Example Deployed URLs)
> Update these URLs to your actual deployed services (Vercel, PythonAnywhere, Render, etc.)

### Auth & Backend (Node/Express)
- **Register:** [Register](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/register)  
- **Login:** [Login](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/login)  
- **Verify Email (OTP):** [Verify Email](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/verify-email)  
- **Forget Password (request OTP):** [Forget Password](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/forget-password)  
- **Reset Password (with OTP):** [Reset Password](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/reset-password)  
- **Logout:** [Logout](https://know-before-you-go-nasa-space-25.vercel.app/api/auth/logout)  

### Events
- **Create event:** [Create Event](https://know-before-you-go-nasa-space-25.vercel.app/api/events/create)
- **Show event weather:** [Show event weather](https://know-before-you-go-nasa-space-25.vercel.app/api/events/:eventId/weather)  
- **Get all events:** [show all events](https://know-before-you-go-nasa-space-25.vercel.app/api/events/all) 
- **Add favorite:** [Add Favorite](https://know-before-you-go-nasa-space-25.vercel.app/api/events/favorite) 
- **Get favorites:** [All Favorites](https://know-before-you-go-nasa-space-25.vercel.app/api/events/favorites/:userId)

---

## Data Models (Summary)

### User (Users model)
- `username`: String  
- `email`: String (unique)  
- `password`: hashed  
- `role`: default `"user"`  
- `province`  
- `isVerified`: boolean  
- `timestamps`  

### Token (tokens model)
- `token`: String (OTP)  
- `userId`: ObjectId (ref User)  
- `createdAt`: Date (TTL index configured with `Constants.EXPIRE.OTP`)  

**Note:** TTL index expects seconds (`900` seconds for 15 minutes). Confirm `Constants.EXPIRE.OTP` value.  

### BlacklistedToken
- `token`: String  
- `expireAt`: Date (the token expiry)  

### Event
- `eventId`: String (uuidv4) — API uses uuid, not Mongo `_id`  
- `title`, `date` (Date), `timezone`  
- `location`: `{ name, lat, lon }`  
- `createdBy`: ObjectId (User)  
- `esiScore`, `recommendations`, `confidence`  
- `timestamps`  

### Favorite
- `user`: ObjectId (User)  
- `event`: String (eventId uuid)  

---

## Constants & TTLs (Recommended)
- `Constants.EXPIRE.OTP`: OTP TTL (recommended 15 minutes → 900 seconds for Mongo TTL).  
- `Constants.EXPIRE.JWT`: JWT expiry (recommended 1h or 24h).  

**Important:** TTL index in Mongo requires expiration in **seconds**; `index: { expires: "15m" }` is invalid.

---

## Deployment Notes

### Backend (Vercel)
- Deploy Node backend as serverless or Node app. Ensure entrypoint `api/index.js` is correct.  
- Set environment variables in Vercel: `JWT_SECRET`, `MONGO_URI`, `ML_URL`, `SMTP`.  
- Do NOT rely on `127.0.0.1:5001` in production — use `process.env.ML_URL`.  
- Push changes to GitHub → Vercel auto-deploys.  

### ML Service (Recommended Hosts)
- Use **PythonAnywhere** (free tier) for small Flask ML service.  
- Upload `ml_service.py` (or `service_ml.py`), dataset, and trained model.  
- Configure WSGI file to import Flask app and set `sys.path`.  
- Create a virtualenv and install `pandas`, `numpy`, `joblib`, `scikit-learn`, `Flask`.  
- Common issue: `FileNotFoundError` → ensure paths for model/CSV match hosted files.  
- Serve ML service via **HTTPS**, then set `ML_URL` in backend `.env`.

