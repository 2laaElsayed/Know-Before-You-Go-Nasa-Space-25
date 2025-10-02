# Know Before You Go (Weather Modeling)

## 1. Objective
Build a predictive model for estimating weather conditions, particularly rainfall, using NASA datasets (IMERG and MERRA-2).

---

## 2. Data
- **Rainfall:** IMERG Daily Mean Precipitation  
- **Temperature & Wind:** MERRA-2 at 2m height and wind speed  
- **Period:** January 2015 → August 2024  
- **Processing:** Spatial re-projection to align grids, units converted (K → °C, kg/m²/s → mm/day)

---

## 3. Methodology
- Data cleaning, unit conversions, and feature selection  
- Models built:
  - **Linear Regression** (simple)
  - **Polynomial Regression** (degree=2) with Ridge regularization
  - **Random Forest Regressor** with hyperparameter tuning
- Evaluation metrics: **R²**, **RMSE**, **MAE**

- **Handling negative predictions:** Values clipped to 0, as rainfall cannot be negative.

---

## 4. Model Results

| Model  | R²      | RMSE  (mm/day) | MAE  (mm/day) |
|--------|----------|----------------|---------------|
| RF     | 0.751   | 0.365          | 0.238         |
| Poly   | 0.556   | 0.488          | 0.399         |
| Linear | 0.399   | 0.567          | 0.463         |

**Interpretation:**  
- Strong negative correlation between temperature and rainfall (corr = -0.64)  
- Tree-based models (RF/XGBoost) captured non-linear relationships, improving prediction accuracy compared to linear regression.

**Feature Importance (Random Forest):**

| Feature          | Importance |
|-----------------|------------|
| Temperature (°C) | 0.67       |
| Wind Speed (m/s) | 0.33       |

---

## 5. Practical Notes
- Negative predicted rainfall values were set to 0  
- Model performance is limited to **two input variables** (temperature & wind)  
- Including **humidity, cloud fraction, soil moisture, ENSO index**, or seasonal indicators could enhance predictive power

---

## 6. Limitations
- Data used are **spatial/temporal averages**, not daily per-cell time series  
- Only two predictors were used; additional variables would improve the model  
- Spatial bias: some cells are coastal/sea; using a Land-Sea Mask could help  

**Interpretation:**  
"Results should be considered within current limitations: the data represent spatial-temporal averages, and no full daily time series were used. Predictions are based on only two variables and therefore represent approximate relationships, not substitutes for short-term weather forecasts based on physical models."

---

## 7. Key Takeaways (for slides / executive summary)
1. Preliminary modeling indicated a **strong negative relationship** between temperature and rainfall (corr = -0.64).  
2. **Random Forest performed best** among tested models (R² = 0.751).  
3. **Next steps:** Retrieve daily/monthly time series and include humidity/cloud variables to improve probability estimates for extreme events (e.g., Very Hot, Very Wet).

---



## 9. Outputs Provided
- `Final_Climate_Dataset.csv` — processed dataset  
- `Rain_Prediction_Model.ipynb` — modeling notebook  
- `predictions_comparison.csv` — predicted vs actual values  
- Feature importance plots / figures  
- Trained Random Forest model: `best_rf_model.joblib`

---

## 10. Optional: XGBoost Results
- R² = 0.606  
- RMSE = 0.459  
- Slightly worse than Random Forest but better than linear regression  

---
## 8. New Condition Definition: Very Uncomfortable

- Defined as a combination of:
  - Temperature condition: Hot or Cold
  - Rain condition: Heavy Rain or Light Rain
  - Wind condition: Windy
- Added new column `Uncomfortable_Cond` to dataset with values "Very Uncomfortable" or "Comfortable".

## 9. Temporal Features Added

- Added `month` and `day_of_year` columns to dataset to enable seasonal and temporal analysis.
---
## 10. Outputs Provided
- `Final_Climate_Dataset.csv` — processed dataset  
- `Rain_Prediction_Model.ipynb` — modeling notebook  
- `predictions_comparison.csv` — predicted vs actual values  
- Feature importance plots / figures  
- Trained Random Forest model: `best_rf_model.joblib`

---

## 11. Optional: XGBoost Results
- R² = 0.606  
- RMSE = 0.459  
- Slightly worse than Random Forest but better than linear regression  


## 12. Additional Features Added

### ✅ Humidity & Pressure
- Integrated **Relative Humidity** and **Surface Pressure** from MERRA-2.  
- Enhanced dataset with more meteorological predictors.  
- Feature importance results showed:
  - Temperature still dominant, but Humidity contributed to improving classification accuracy.  

---

### ✅ Classification Model
- Built a **Random Forest Classifier** for rainfall events (No Rain, Light, Moderate, Heavy).  
- **Accuracy:** ~82%  
- Strong at detecting *No Rain* and *Light Rain*.  
- Provided **confusion matrix** and **classification report**.  

---

### ✅ Smart Alerts
- Developed a function `smart_alert(temp, wind, humidity, pressure)` that outputs:  
  - Rain probability  
  - Confidence level  
  - Message:  
    - `"⚠️ 95% chance of Light Rain"`  
    - `"✅ Safe: No strong rain signal"`  

---

### ✅ Event Planner
- User enters event details (date, lat/lon, temperature, wind, humidity, pressure).  
- System gives risk assessment:  
  - `"⚠️ High risk of rain – prepare a backup plan"`  
  - `"✅ Low risk – safe for outdoor events"`  

---

### ✅ Future Work
- Integrate **real-time nowcasting (0–6 hours)** using streaming NASA IMERG data.  
- Add new predictors (cloud fraction, soil moisture, ENSO index).  
- Build **interactive dashboards** for visualization.  
- Enable **crowdsourcing**: allow users to report rain in real-time to improve model accuracy.  

---
**End of Report**
