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

## Example Responses

### Event Weather (GET `/api/events/:eventId/weather`)
```json
{
  "eventId": "d5b7d9f2-8d4e-4e8e-b3df-cc91ff12ab3d",
  "location": { "lat": 30.0444, "lon": 31.2357 },
  "esiScore": 0.82,
  "recommendations": "Event is safe to proceed",
  "confidence": 0.91
}
