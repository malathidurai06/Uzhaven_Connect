"""
Generates synthetic training data for the price recommendation and demand
forecasting models, so the project can be trained and demoed end-to-end
without needing a real scraped dataset.

For your final report, you can swap this file's output for real historical
mandi price data (e.g., from Agmarknet / data.gov.in) with the same column
structure, and the training scripts will work unchanged.
"""
# pyrefly: ignore [missing-import]
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

np.random.seed(42)

CROPS = ["tomato", "brinjal", "onion", "carrot", "cabbage", "potato", "beans", "okra"]
REGIONS = ["Tirunelveli", "Madurai", "Nagercoil", "Tuticorin", "Tenkasi"]

BASE_PRICE = {
    "tomato": 25, "brinjal": 22, "onion": 30, "carrot": 28,
    "cabbage": 18, "potato": 24, "beans": 35, "okra": 26,
}

# ---------- Price dataset ----------
rows = []
start_date = datetime(2024, 1, 1)
for day in range(365):
    date = start_date + timedelta(days=day)
    month = date.month
    for crop in CROPS:
        for region in REGIONS:
            seasonal = 1 + 0.15 * np.sin(2 * np.pi * month / 12)
            demand_index = np.random.uniform(0.8, 1.3)
            noise = np.random.normal(0, 1.5)
            price = BASE_PRICE[crop] * seasonal * demand_index + noise
            rows.append({
                "date": date.strftime("%Y-%m-%d"),
                "crop_name": crop,
                "region": region,
                "month": month,
                "demand_index": round(demand_index, 2),
                "price_per_kg": round(max(price, 5), 2),
            })

price_df = pd.DataFrame(rows)
price_df.to_csv("data/sample_prices.csv", index=False)
print(f"Wrote data/sample_prices.csv with {len(price_df)} rows")

# ---------- Demand dataset (daily order volume per crop/region) ----------
demand_rows = []
for day in range(365):
    date = start_date + timedelta(days=day)
    month = date.month
    weekday = date.weekday()
    for crop in CROPS:
        for region in REGIONS:
            seasonal = 1 + 0.2 * np.sin(2 * np.pi * month / 12)
            weekend_boost = 1.15 if weekday >= 5 else 1.0
            base_demand = {
                "tomato": 400, "brinjal": 250, "onion": 350, "carrot": 200,
                "cabbage": 180, "potato": 300, "beans": 150, "okra": 220,
            }[crop]
            noise = np.random.normal(0, 20)
            demand_kg = max(base_demand * seasonal * weekend_boost + noise, 20)
            demand_rows.append({
                "date": date.strftime("%Y-%m-%d"),
                "crop_name": crop,
                "region": region,
                "demand_kg": round(demand_kg, 1),
            })

demand_df = pd.DataFrame(demand_rows)
demand_df.to_csv("data/sample_demand.csv", index=False)
print(f"Wrote data/sample_demand.csv with {len(demand_df)} rows")
