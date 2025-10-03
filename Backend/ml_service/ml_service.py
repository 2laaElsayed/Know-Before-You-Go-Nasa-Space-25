# ml_service.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import os
import math

app = Flask(__name__)

# -----------------------
# Paths
# -----------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # Backend/ml_service
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

MODEL_PATH = os.path.join(ROOT_DIR, "AI", "best_rf_model.joblib")
CSV_PATH = os.path.join(ROOT_DIR, "AI", "Final_Climate_Dataset.csv")

# -----------------------
# Load model & data
# -----------------------
model = joblib.load(MODEL_PATH)
df = pd.read_csv(CSV_PATH)

# -----------------------
# Helper functions
# -----------------------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def find_nearest_row(lat, lon, date_str=None):
    lat_col = None
    lon_col = None
    for c in df.columns:
        if c.lower() in ("latitude", "lat", "lat_deg", "y"):
            lat_col = c
        if c.lower() in ("longitude", "lon", "lon_deg", "x"):
            lon_col = c
    if lat_col is None or lon_col is None:
        raise ValueError("Could not find latitude/longitude columns in CSV.")

    subdf = df.copy()

    # date filtering
    date_col = None
    for c in df.columns:
        if c.lower() in ("date", "time", "datetime"):
            date_col = c
            break
    if date_str and date_col:
        try:
            qdate = pd.to_datetime(date_str)
            matches = subdf[pd.to_datetime(subdf[date_col]) == qdate]
            if matches.shape[0] > 0:
                subdf = matches
            else:
                subdf[date_col+"_diff"] = (pd.to_datetime(subdf[date_col]) - qdate).abs()
                subdf = subdf.sort_values(by=date_col+"_diff").head(200)
        except Exception:
            pass

    subdf["__dist__"] = subdf.apply(lambda r: haversine(lat, lon, float(r[lat_col]), float(r[lon_col])), axis=1)
    nearest = subdf.sort_values("__dist__").iloc[0]
    return nearest

# -----------------------
# API endpoints
# -----------------------
@app.route("/predict_from_obs", methods=["POST"])
def predict_from_obs():
    payload = request.json
    if not payload:
        return jsonify({"error": "JSON body required"}), 400

    if "temperature_C" not in payload or "wind_speed_ms" not in payload:
        return jsonify({"error": "Provide temperature_C and wind_speed_ms in request body"}), 400

    feat = pd.DataFrame([{
        "temperature_C": payload["temperature_C"],
        "wind_speed_ms": payload["wind_speed_ms"]
    }])

    pred = model.predict(feat)[0]
    pred = max(0.0, float(pred))
    return jsonify({"predictedRain_mm_day": pred})

@app.route("/predict_from_location", methods=["POST"])
def predict_from_location_endpoint():  
    payload = request.json or {}
    if "latitude" not in payload or "longitude" not in payload:
        return jsonify({"error": "Provide latitude and longitude"}), 400

    lat = float(payload["latitude"])
    lon = float(payload["longitude"])
    date_str = payload.get("date", None)

    try:
        nearest = find_nearest_row(lat, lon, date_str)
    except ValueError as e:
        return jsonify({"error": str(e)}), 500

    # تحديد الأعمدة الصحيحة
    temp_col = None
    wind_col = None
    for c in df.columns:
        if c.lower() in ("temperature_c", "temperature"):
            temp_col = c
        if c.lower() in ("temperature_k",):
            temp_col = c
        if c.lower() in ("wind_speed_ms", "wind_speed"):
            wind_col = c

    if temp_col is None or wind_col is None:
        return jsonify({"error": "Could not find temperature or wind columns in CSV."}), 500

    temp = float(nearest[temp_col])
    if temp_col.lower() == "temperature_k":  
        temp = temp - 273.15

    wind = float(nearest[wind_col])
    feat = pd.DataFrame([{"temperature_C": temp, "wind_speed_ms": wind}])
    pred = model.predict(feat)[0]
    pred = max(0.0, float(pred))

    esi = round(pred * 100, 2)
    recommendation = "High risk – plan alternative" if pred >= 0.6 else "Safe – Low risk of rain"
    comfort = "Very Uncomfortable" if nearest.get("Uncomfortable_Cond", "").lower() == "very uncomfortable" else "Comfortable"

    return jsonify({
        "predictedRain_mm_day": pred,
        "temperature_used_C": temp,
        "wind_used_ms": wind,
        "esiScore": esi,
        "recommendation": recommendation,
        "comfortCondition": comfort,
        "nearest_row_info": {
            "latitude": float(nearest[[c for c in nearest.index if c.lower() in ('latitude','lat','lat_deg','y')][0]]),
            "longitude": float(nearest[[c for c in nearest.index if c.lower() in ('longitude','lon','lon_deg','x')][0]]),
            "distance_m": float(nearest["__dist__"])
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
