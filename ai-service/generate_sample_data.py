"""
Generates synthetic training data for the price recommendation and demand
forecasting models, covering all 40+ supported Tamil Nadu crops.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

np.random.seed(42)

REGIONS = ["Tirunelveli", "Madurai", "Nagercoil", "Tuticorin", "Tenkasi"]

BASE_PRICE = {
    # Fruits
    "mango": 60, "raw_mango": 40, "banana": 30, "guava": 35, "papaya": 28,
    "pomegranate": 90, "jackfruit": 45, "watermelon": 20,
    # Vegetables
    "tomato": 26, "brinjal": 32, "onion": 42, "carrot": 38, "cabbage": 22,
    "potato": 28, "beans": 54, "okra": 35, "ladies_finger": 35, "drumstick": 48,
    "chilli": 45, "beetroot": 36, "coconut": 25, "broccoli": 65,
    # Tubers
    "yam": 45, "tapioca": 32, "sweet_potato": 38, "colocasia": 42,
    # Keerai & Greens
    "murungai_keerai": 20, "agathi_keerai": 22, "siru_keerai": 18, "palak_keerai": 25,
    "vallarai_keerai": 28, "ponnanganni_keerai": 24,
    # South Nell & Grains
    "ponni_rice": 38, "seeraga_samba": 85, "thooyamalli": 65, "karuppu_kavuni": 120,
    "mappillai_samba": 75, "ragi": 42, "thinai": 55, "black_gram": 95,
    # Banana By-Products
    "banana_chips": 160, "banana_stem": 25, "banana_flower": 30, "banana_leaf": 80,
    "banana_fiber": 150,
}

CROPS = list(BASE_PRICE.keys())

# ---------- Price dataset ----------
rows = []
start_date = datetime(2024, 1, 1)
for day in range(365):
    date = start_date + timedelta(days=day)
    month = date.month
    for crop in CROPS:
        for region in REGIONS:
            seasonal = 1 + 0.12 * np.sin(2 * np.pi * month / 12)
            demand_index = np.random.uniform(0.85, 1.25)
            noise = np.random.normal(0, 1.2)
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
BASE_DEMAND = {
    "mango": 320, "raw_mango": 180, "banana": 400, "guava": 160, "papaya": 150,
    "pomegranate": 120, "jackfruit": 90, "watermelon": 250,
    "tomato": 450, "brinjal": 280, "onion": 380, "carrot": 220, "cabbage": 190,
    "potato": 320, "beans": 160, "okra": 240, "ladies_finger": 240, "drumstick": 180,
    "chilli": 140, "beetroot": 130, "coconut": 300, "broccoli": 80,
    "yam": 220, "tapioca": 260, "sweet_potato": 150, "colocasia": 110,
    "murungai_keerai": 180, "agathi_keerai": 120, "siru_keerai": 140, "palak_keerai": 130,
    "vallarai_keerai": 100, "ponnanganni_keerai": 110,
    "ponni_rice": 500, "seeraga_samba": 180, "thooyamalli": 140, "karuppu_kavuni": 90,
    "mappillai_samba": 100, "ragi": 200, "thinai": 120, "black_gram": 170,
    "banana_chips": 80, "banana_stem": 90, "banana_flower": 70, "banana_leaf": 200,
    "banana_fiber": 50,
}

demand_rows = []
for day in range(365):
    date = start_date + timedelta(days=day)
    month = date.month
    weekday = date.weekday()
    for crop in CROPS:
        for region in REGIONS:
            seasonal = 1 + 0.18 * np.sin(2 * np.pi * month / 12)
            weekend_boost = 1.15 if weekday >= 5 else 1.0
            base_dem = BASE_DEMAND.get(crop, 150)
            noise = np.random.normal(0, 15)
            demand_kg = max(base_dem * seasonal * weekend_boost + noise, 10)
            demand_rows.append({
                "date": date.strftime("%Y-%m-%d"),
                "crop_name": crop,
                "region": region,
                "demand_kg": round(demand_kg, 1),
            })

demand_df = pd.DataFrame(demand_rows)
demand_df.to_csv("data/sample_demand.csv", index=False)
print(f"Wrote data/sample_demand.csv with {len(demand_df)} rows")
