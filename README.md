# Know Before You Go 🌦️
![download (3)](https://github.com/user-attachments/assets/4288f075-626e-419f-8c06-d3b486b12a7d)


## Overview

Extreme weather events affect outdoor activities, agriculture, logistics, and public safety. Traditional short-term forecasts (1–3 days) often fail to provide actionable long-term insights. Our project leverages **NASA datasets (Giovanni portal – IMERG & MERRA-2)** and **probabilistic modeling** to give users an interactive dashboard where they can:

* Select a **location and time** (by typing, pinning on the map, or drawing a boundary).
* Explore **historical NASA data** combined with **forecast models** to estimate probabilities of weather conditions.
* Visualize **clear, interactive statistics** (time series, probability distributions, heatmaps).
* Receive **text-based explanations** that are simple and actionable (e.g., *“High risk of heavy rain – consider backup plans”*).
* **Export results** in CSV or JSON with metadata (units + source).
  
- [Postman Collection](https://www.postman.com/wanda1-9363/workspace/weather-api/collection/47777232-475e7c37-200c-41ba-8c5a-abc073bcbe4e?action=share&creator=47777232)  

### Example Use Case

*“There’s a 65% chance that temperatures will exceed 35°C in this location in early August.”*

This helps event planners, farmers, and communities prepare for extreme weather well in advance.

---

## 1. Objective

Build a predictive model for estimating weather conditions, particularly rainfall, using NASA datasets (IMERG and MERRA-2).

---

## 2. Data

* **Source:** NASA Giovanni portal (IMERG for precipitation, MERRA-2 for atmosphere & air quality).
* **Variables considered:**

  * Precipitation (rainfall intensity)
  * Temperature (incl. Extreme Heat Index)
  * Windspeed
  * Humidity
 

We focus on these **key variables** since they directly impact outdoor planning, without overwhelming users with unnecessary complexity.

---

## 3. Data Processing & Modeling

1. **Data Collection**

   * Downloaded from NASA Giovanni portal.
   * Pre-processed to align spatial/temporal granularity.
2. **Feature Engineering**

   * Extracted climate indicators for each location & time.
   * Standardized units & added metadata.
3. **Modeling Approach**

   * Probabilistic weather prediction using historical patterns.
   * Time-series analysis for trends.
   * Probability distributions to estimate likelihood of extreme conditions.
   * Machine learning algorithms (e.g., Random Forest, ARIMA, LSTM for sequential patterns).

---
## 4. Mobile Application Overview 

We developed a **cross-platform mobile application** using **Flutter** to provide users with on-the-go access to weather insights.  
The app allows users to:  
- Select a location and time directly from their mobile device.  
- View personalized forecasts and interactive charts.  
- Receive simplified text-based recommendations (e.g., *"High chance of heavy rain – consider carrying an umbrella"*).  

This ensures accessibility and usability beyond the web dashboard, making forecasts available anytime, anywhere.  


https://github.com/user-attachments/assets/279083fc-11bf-4ecb-b8b9-9196c24e1d6a


 



---
## 5. Website Features

![photo_2025-10-09_00-07-54](https://github.com/user-attachments/assets/2e06d3fd-68f4-492d-a37a-f889de66a369)


* **Personalized Panel:** User selects location & time.
 
![photo_2025-10-09_00-08-00](https://github.com/user-attachments/assets/450b033b-8f17-4678-9a35-e6f9cf1c4c4e)

  
* **Interactive Visualizations:**



![WhatsApp Image 2025-10-08 at 21 24 57_db40f085](https://github.com/user-attachments/assets/cd803994-0908-48cd-97c6-79f8522748bf)
![WhatsApp Image 2025-10-08 at 21 24 57_afc322ee](https://github.com/user-attachments/assets/b907bc23-90df-4e71-91a1-9dc450f74c1b)



* **Explanations:** Clear risk summaries (e.g., *“High wind probability – outdoor events may be unsafe”*).
* **Download Options:** CSV & JSON with metadata.

  ### Weather Integration Process
  <img width="1222" height="787" alt="image" src="https://github.com/user-attachments/assets/2ec9c6be-bed5-49ca-ac74-53e0f9617cd5" />



---

## 6. Machine Learning Models

* **Classification models:** To classify comfort levels (e.g., Comfortable, Uncomfortable, Extreme).
* **Regression models:** To estimate numerical values (rainfall amount, temperature range).
* **Evaluation Metrics:** Accuracy, F1-score, RMSE for continuous variables.
* **Output:** Probability of weather conditions (e.g., 70% chance of heavy rain).

---

## 7. API Endpoints

* `/api/events/favorites/:eventId` → Add the event to the logged-in user's favorites.
* `/api//events/favorites` → Get all events in the logged-in user's favorites.

---
## ⚛️ Frontend Development

- **React.js** – for building dynamic and interactive user interfaces.  
- **React Router DOM** – for routing, navigation, and implementing Protected Routes.  
- **Axios / Fetch API** – for handling API requests and data fetching.  
- **Context API / useState / useEffect** – for managing state and user preferences (e.g. dark/light mode).  
- **React Icons** – for adding consistent UI icons.  
- **Tailwind CSS** *(or CSS Modules / Styled Components)* – for styling the dashboard and pages.  
  
# 🗺️ Maps & Location

- **Leaflet.js** – for displaying an interactive map.  
- **React-Leaflet** – for integrating Leaflet maps within React components.  
- **OpenStreetMap / Mapbox Tiles** – as a base map layer (for location visualization).  
- **Geolocation API** – to allow users to select or detect locations.  

-
# 🌦️ Weather & Events

- **Custom Weather API (team-built)** – for fetching real-time weather predictions and event-related insights.  
- **Chart.js / Recharts / D3.js** *(if used)* – for data visualization (temperature trends, rain probability, etc.).  
- **Dynamic Dashboard Components** – for showing 3-day forecasts, rain probability, and event-specific conditions.  
--
# 🔐 Authentication

- **JWT-based Authentication API** *(via backend)*.  
- **Login & Register pages** connected with the backend endpoints.  
- **Protected Routing** – ensures only authenticated users access certain pages.  
--
# ⭐ Features

- **Interactive Weather Dashboard** (today + 3-day forecast).  
- **Add Event** feature with date, time, and location selection on map.  
- **EventWeather Page** – displays weather conditions for selected event location/time.  
- **Favorites Section** – lets users save favorite events/locations.  
- **Dark / Light Mode Toggle** – user preference saved dynamically.  
- **Real-time Weather Insights** – fetched from backend & displayed visually.  

---


## 8. Architecture
<img width="1267" height="766" alt="image" src="https://github.com/user-attachments/assets/5de2aa5c-6443-4493-9f23-003973110229" />

* **Frontend:** React.js .
* **Backend:** Node.js/Express (handles API calls).
* **Data Layer:** Processed NASA datasets.
* **ML Models:** Probability estimations (Python, scikit-learn / statsmodels).
* **Deployment:** Docker + Cloud hosting.
  
### Overall System Architecture
<img width="1717" height="762" alt="image" src="https://github.com/user-attachments/assets/dfb7c63c-0b25-435f-97c7-f0f44244cec6" />

### Service Communication Architecture
<img width="1110" height="823" alt="image" src="https://github.com/user-attachments/assets/e1c858a7-1318-43f1-8114-b139fbc35b2d" />


---

## 9. Results & Evaluation

* Compared different ML models for rainfall and temperature predictions.
* Best-performing model for rainfall: **Random Forest** with F1-score of 0.82.
* Best-performing model for temperature: **ARIMA** with RMSE of 2.4°C.
* Visualization and text-based outputs validated by domain experts.

---
## 10. Deployment Notes

### Backend (Vercel)
- Deploy Node backend as a serverless function or Node app.  
- Ensure entrypoint `api/index.js` is correct.  
- Set environment variables in Vercel (`JWT_SECRET`, `MONGO_URI`, `ML_URL`, `SMTP_*`).  
- MongoDB Atlas: whitelist IPs or use `0.0.0.0/0` for testing.  
- **Do not hardcode** `127.0.0.1:5001` in production → always use `process.env.ML_URL`.  

### ML Service (PythonAnywhere)
- Upload Flask app (`ml_service.py`), dataset, and trained model.  
- Install requirements: `pandas`, `numpy`, `scikit-learn`, `joblib`, `Flask`.  
- Ensure paths to model/CSV are correct.  
- Update backend `.env` with `ML_URL`.  

### Frontend (Netlify)
- Build frontend (React) with production command (`npm run dev`).  
- Deploy build folder to Netlify.  
- Configure redirect rules in `_redirects` file if needed:  

## 11. Acknowledgments 🙌

Huge thanks to our amazing team for making this possible:

* **Frontend** – UI/UX, interactive graphs, dashboards.
* **Backend** – APIs, data pipeline, integration.
* **Mobile** – Mobile app interface for on-the-go forecasts.
* **Data Science** – Data preprocessing, modeling, probability analysis.



## 12. Team Contributions

- [Tahany Emad](https://github.com/Tahanyemad16)  
- [Basmala Saeed](https://github.com/basmalaeltabakh)  
- [AhmedAbdAl-Aziz](https://github.com/AhmedAbdAl-Aziz)  
- [Alaa Elsayed](https://github.com/2laaElsayed)
- [Gamal-Abbas](https://github.com/Gamal-Abbas)


---
## 13. References

- NASA GPM IMERG: https://gpm.nasa.gov/data/imerg
- NASA MERRA-2: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/
- Giovanni Portal: https://giovanni.gsfc.nasa.gov/
---

Together, we built **Know Before You Go** to make long-term weather insights **accessible, clear, and actionable**.

 
