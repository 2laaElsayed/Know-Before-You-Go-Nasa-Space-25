# Know Before You Go 🌦️
![download (3)](https://github.com/user-attachments/assets/4288f075-626e-419f-8c06-d3b486b12a7d)


## Overview

Extreme weather events affect outdoor activities, agriculture, logistics, and public safety. Traditional short-term forecasts (1–3 days) often fail to provide actionable long-term insights. Our project leverages **NASA datasets (Giovanni portal – IMERG & MERRA-2)** and **probabilistic modeling** to give users an interactive dashboard where they can:

* Select a **location and time** (by typing, pinning on the map, or drawing a boundary).
* Explore **historical NASA data** combined with **forecast models** to estimate probabilities of weather conditions.
* Visualize **clear, interactive statistics** (time series, probability distributions, heatmaps).
* Receive **text-based explanations** that are simple and actionable (e.g., *“High risk of heavy rain – consider backup plans”*).
* **Export results** in CSV or JSON with metadata (units + source).

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

## 4. Website Features
 <img width="1895" height="910" alt="image" src="https://github.com/user-attachments/assets/974e5fb5-dd62-491a-8789-d8748e153b75" />

* **Personalized Panel:** User selects location & time.
  <img width="1893" height="850" alt="image" src="https://github.com/user-attachments/assets/2318a177-7bc5-431b-8537-3d55733f6abc" />

  
* **Interactive Visualizations:**
<img width="1251" height="845" alt="image" src="https://github.com/user-attachments/assets/e3d58078-43c0-4fcf-968d-1103cfd0752e" />
<img width="1782" height="747" alt="image" src="https://github.com/user-attachments/assets/5d1ad7fc-3862-42ce-8ace-bdc52025a1d4" />



* **Explanations:** Clear risk summaries (e.g., *“High wind probability – outdoor events may be unsafe”*).
* **Download Options:** CSV & JSON with metadata.

  ### Weather Integration Process
  <img width="1222" height="787" alt="image" src="https://github.com/user-attachments/assets/2ec9c6be-bed5-49ca-ac74-53e0f9617cd5" />



---

## 5. Machine Learning Models

* **Classification models:** To classify comfort levels (e.g., Comfortable, Uncomfortable, Extreme).
* **Regression models:** To estimate numerical values (rainfall amount, temperature range).
* **Evaluation Metrics:** Accuracy, F1-score, RMSE for continuous variables.
* **Output:** Probability of weather conditions (e.g., 70% chance of heavy rain).

---

## 6. API Endpoints

* `/api/events/favorites/:eventId` → Add the event to the logged-in user's favorites.
* `/api//events/favorites` → Get all events in the logged-in user's favorites.

---

## 7. Architecture
<img width="1267" height="766" alt="image" src="https://github.com/user-attachments/assets/5de2aa5c-6443-4493-9f23-003973110229" />

* **Frontend:** React (interactive dashboard).
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

## 10. Acknowledgments 🙌

Huge thanks to our amazing team for making this possible:

* **Frontend Team** – UI/UX, interactive graphs, dashboards.
* **Backend Team** – APIs, data pipeline, integration.
* **Mobile Team** – Mobile app interface for on-the-go forecasts.
* **Data Science Team** – Data preprocessing, modeling, probability analysis.


## 11. Team Contributions


---
## 12. References

- NASA GPM IMERG: https://gpm.nasa.gov/data/imerg
- NASA MERRA-2: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/
- Giovanni Portal: https://giovanni.gsfc.nasa.gov/
---

Together, we built **Know Before You Go** to make long-term weather insights **accessible, clear, and actionable**.

 
