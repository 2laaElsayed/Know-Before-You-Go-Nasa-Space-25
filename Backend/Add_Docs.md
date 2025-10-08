# Know Before You Go — Backend

## Overview
This Folder contains the backend API for **Know Before You Go**:

- **Node/Express backend** for authentication, events, favorites, user weather forecast, and integration with an ML service.
- **Lightweight Python Flask ML service** that reads a precomputed dataset and a trained RandomForest model to predict rainfall (and produce ESI + recommendations).

---
## **Backend Base URL (Vercel):**  
  [https://know-before-you-go-nasa-space-25.vercel.app/api](https://know-before-you-go-nasa-space-25.vercel.app/api)

## Main Features
- User registration with hashed password and email OTP verification.
- JWT-based authentication, logout via token blacklisting.
- Forget password + reset via OTP.
- Event management (create, edit, list, CSV export).
- Event weather preview that calls the ML service.
- Favorite events (by eventId uuid).
- User-specific 3-day forecast (via ML service).
- Integration with external ML service (Flask API).

---

## API Endpoints

### Authentication
| Method | URL | Body / Params | Description |
|--------|-----|---------------|-------------|
| POST | `/api/auth/register` | `{ username, email, password, province }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login and get JWT |
| POST | `/api/auth/verify-email` | `{ email, otp }` | Verify user email with OTP |
| POST | `/api/auth/forget-password` | `{ email }` | Request password reset OTP |
| POST | `/api/auth/reset-password` | `{ email, otp, newPassword }` | Reset password |
| POST | `/api/auth/logout` | None (JWT in header) | Logout user (blacklist token) |

---

### User
| Method | URL | Body / Params | Description |
|--------|-----|---------------|-------------|
| GET | `/api/user/predict-three-days` | None (JWT required) | Get 3-day weather forecast for user’s province |

---

### Events
| Method | URL | Body / Params | Description |
|--------|-----|---------------|-------------|
| POST | `/api/events/create` | `{ title, date, province, recurrence, notes }` | Create a new event |
| PUT | `/api/events/edit/:eventId` | `{ title?, date?, province?, recurrence?, notes? }` | Edit existing event |
| GET | `/api/events/all` | None | Get all events |
| GET | `/api/events/:eventId/weather` | Path param: `eventId` | Get weather prediction for event |
| GET | `/api/events/download-csv` | None (JWT required) | Download CSV of all events created by user |
| POST | `/api/events/favorite` | `{ eventId }` | Add event to favorites |
| GET | `/api/events/favorites/:userId` | Path param: `userId` | Get user’s favorite events |

---

---

## Environment Variables

| Variable      | Description |
|---------------|-------------|
| `MONGO_URI`   | MongoDB Atlas connection string |
| `JWT_SECRET`  | Secret key for JWT signing |
| `ML_URL`      | URL of Flask ML service (PythonAnywhere / Render) |
| `SMTP_HOST`   | SMTP server host |
| `SMTP_PORT`   | SMTP port |
| `SMTP_USER`   | Email user for sending OTPs |
| `SMTP_PASS`   | Email password / app password |

---

## Deployment Notes

### Backend (Vercel)
- Deploy Node backend as serverless or Node app.  
- Ensure entrypoint `api/index.js` is correct.  
- Set environment variables in Vercel (`JWT_SECRET`, `MONGO_URI`, `ML_URL`, `SMTP_*`).  
- MongoDB Atlas: whitelist IP or use `0.0.0.0/0` for testing.  
- **Do not hardcode** `127.0.0.1:5001` in production → always use `process.env.ML_URL`.  

### ML Service (PythonAnywhere / Render)
- Upload Flask app (`ml_service.py`), dataset, and trained model.  
- Install requirements: `pandas`, `numpy`, `scikit-learn`, `joblib`, `Flask`.  
- Ensure paths to model/CSV are correct.  
- Update backend `.env` with `ML_URL`.  
